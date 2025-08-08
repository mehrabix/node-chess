import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { spawn } from 'child_process'
import { Chess } from 'chess.js'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
app.use(express.json())

// Stockfish engine management
class StockfishEngine {
  private process: any = null
  private _isReady = false

  get isReady(): boolean {
    return this._isReady
  }
  private moveResolve: ((move: any) => void) | null = null
  private moveReject: ((error: Error) => void) | null = null

  constructor(private stockfishPath: string = 'C:\\Program Files\\stockfish\\stockfish-windows-x86-64-avx2.exe') {}

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.process = spawn(this.stockfishPath)
        let isReady = false
        let timeout: NodeJS.Timeout

        this.process.stdout?.on('data', (data: Buffer) => {
          const output = data.toString()
          
          if (output.includes('readyok') && !isReady) {
            isReady = true
            this._isReady = true
            clearTimeout(timeout)
            resolve()
          }
        })

        this.process.stderr?.on('data', (data: Buffer) => {
          console.error('Stockfish error:', data.toString())
        })

        this.process.on('error', (error: Error) => {
          clearTimeout(timeout)
          reject(new Error(`Failed to start Stockfish: ${error.message}`))
        })

        this.process.on('close', (code: number) => {
          if (!isReady) {
            clearTimeout(timeout)
            reject(new Error(`Stockfish process closed with code ${code}`))
          }
        })

        // Send initialization commands
        setTimeout(() => this.sendCommand('uci'), 100)
        setTimeout(() => this.sendCommand('isready'), 500)

        // Timeout after 15 seconds
        timeout = setTimeout(() => {
          if (this.process) {
            this.process.kill()
          }
          reject(new Error('Stockfish initialization timeout'))
        }, 15000)
      } catch (error) {
        reject(error)
      }
    })
  }

  private sendCommand(command: string): void {
    if (this.process && this.process.stdin) {
      this.process.stdin.write(command + '\n')
    }
  }

  private handleOutput(output: string): void {
    const lines = output.split('\n')
    
    for (const line of lines) {
      if (line.startsWith('readyok')) {
        this._isReady = true
      } else if (line.startsWith('bestmove')) {
        this.handleBestMove(line)
      }
    }
  }

  private handleBestMove(line: string): void {
    const parts = line.split(' ')
    if (parts.length >= 2) {
      const uciMove = parts[1]
      const score = this.extractScore(line)
      const depth = this.extractDepth(line)
      
      const stockfishMove = {
        move: uciMove,
        score: score || 0,
        depth: depth || 0,
        time: Date.now()
      }

      if (this.moveResolve) {
        this.moveResolve(stockfishMove)
        this.moveResolve = null
        this.moveReject = null
      }
    }
  }

  private extractScore(line: string): number | null {
    const scoreMatch = line.match(/score (cp|mate) (-?\d+)/)
    if (scoreMatch) {
      const type = scoreMatch[1]
      const value = parseInt(scoreMatch[2])
      if (type === 'mate') {
        return value > 0 ? 10000 : -10000
      }
      return value
    }
    return null
  }

  private extractDepth(line: string): number | null {
    const depthMatch = line.match(/depth (\d+)/)
    return depthMatch ? parseInt(depthMatch[1]) : null
  }

  async setMoves(moves: string[]): Promise<void> {
    if (moves.length === 0) {
      this.sendCommand('position startpos')
    } else {
      // Convert algebraic moves to UCI format
      const chess = new Chess()
      const uciMoves: string[] = []
      
      moves.forEach(move => {
        try {
          const chessMove = chess.move(move)
          if (chessMove) {
            uciMoves.push(chessMove.from + chessMove.to + (chessMove.promotion || ''))
          }
        } catch (error) {
          console.error('Invalid move in history:', move)
        }
      })
      
      if (uciMoves.length > 0) {
        this.sendCommand(`position startpos moves ${uciMoves.join(' ')}`)
      } else {
        this.sendCommand('position startpos')
      }
    }
  }

  async getBestMove(depth: number = 10, timeLimit: number = 2000): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isReady) {
        reject(new Error('Stockfish engine not ready'))
        return
      }

      this.moveResolve = resolve
      this.moveReject = reject
      
      this.sendCommand(`go depth ${depth} movetime ${timeLimit}`)
      
      // Timeout after timeLimit + 2 seconds
      setTimeout(() => {
        if (this.moveReject) {
          this.moveReject(new Error('Stockfish move timeout'))
          this.moveResolve = null
          this.moveReject = null
        }
      }, timeLimit + 2000)
    })
  }

  async quit(): Promise<void> {
    this.sendCommand('quit')
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }
}

// Initialize Stockfish engine
const engine = new StockfishEngine()

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: engine.isReady })
})

app.post('/api/move', async (req, res) => {
  try {
    const { moves, depth = 10, timeLimit = 2000 } = req.body
    
    await engine.setMoves(moves || [])
    const result = await engine.getBestMove(depth, timeLimit)
    
    // Convert UCI move to algebraic notation
    const chess = new Chess()
    if (moves) {
      moves.forEach(move => {
        try {
          chess.move(move)
        } catch (error) {
          console.error('Invalid move:', move)
        }
      })
    }
    
    try {
      const move = chess.move(result.move)
      result.algebraic = move.san
    } catch (error) {
      result.algebraic = result.move
    }
    
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Socket.IO for real-time communication
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('getMove', async (data) => {
    try {
      const { moves, depth = 10, timeLimit = 2000 } = data
      
      await engine.setMoves(moves || [])
      const result = await engine.getBestMove(depth, timeLimit)
      
      // Convert UCI move to algebraic notation
      const chess = new Chess()
      if (moves) {
        moves.forEach(move => {
          try {
            chess.move(move)
          } catch (error) {
            console.error('Invalid move:', move)
          }
        })
      }
      
      try {
        const move = chess.move(result.move)
        result.algebraic = move.san
      } catch (error) {
        result.algebraic = result.move
      }
      
      socket.emit('moveResult', result)
    } catch (error) {
      socket.emit('moveError', { error: error.message })
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Initialize engine and start server
async function startServer() {
  try {
    await engine.initialize()
    console.log('✅ Stockfish engine initialized successfully')
    
    const PORT = process.env.PORT || 5000
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🌐 Web UI available at http://localhost:3000`)
    })
  } catch (error) {
    console.error('❌ Failed to initialize Stockfish engine:', error.message)
    console.log('💡 Make sure Stockfish is installed at the correct path')
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...')
  await engine.quit()
  process.exit(0)
})

startServer() 