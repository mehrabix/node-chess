import { spawn, ChildProcess } from 'child_process';
import { Chess } from 'chess.js';
import { StockfishMove } from './types';

export class StockfishEngine {
  private process: ChildProcess | null = null;
  private isReady = false;
  private movePromise: Promise<StockfishMove> | null = null;
  private moveResolve: ((move: StockfishMove) => void) | null = null;
  private moveReject: ((error: Error) => void) | null = null;
  private chess: Chess = new Chess();

  constructor(private stockfishPath: string = 'C:\\Program Files\\stockfish\\stockfish-windows-x86-64-avx2.exe') {}

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.process = spawn(this.stockfishPath);
        let isReady = false;
        let timeout: NodeJS.Timeout;
        
        this.process.stdout?.on('data', (data) => {
          const output = data.toString();
          this.handleOutput(output);
          
          // Check if Stockfish is ready
          if (output.includes('readyok') && !isReady) {
            isReady = true;
            this.isReady = true;
            clearTimeout(timeout);
            resolve();
          }
        });

        this.process.stderr?.on('data', (data) => {
          console.error('Stockfish error:', data.toString());
        });

        this.process.on('error', (error) => {
          clearTimeout(timeout);
          reject(new Error(`Failed to start Stockfish: ${error.message}`));
        });

        this.process.on('close', (code) => {
          if (!isReady) {
            clearTimeout(timeout);
            reject(new Error(`Stockfish process closed with code ${code}`));
          }
        });

        // Send initialization commands with proper timing
        setTimeout(() => this.sendCommand('uci'), 100);
        setTimeout(() => this.sendCommand('isready'), 500);

        // Timeout after 15 seconds
        timeout = setTimeout(() => {
          if (this.process) {
            this.process.kill();
          }
          reject(new Error('Stockfish initialization timeout'));
        }, 15000);
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleOutput(output: string): void {
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('readyok')) {
        this.isReady = true;
      } else if (line.startsWith('bestmove')) {
        this.handleBestMove(line);
      }
    }
  }

  private handleBestMove(line: string): void {
    const parts = line.split(' ');
    if (parts.length >= 2) {
      const uciMove = parts[1];
      const score = this.extractScore(line);
      const depth = this.extractDepth(line);
      
      // Convert UCI move to algebraic notation
      const move = this.convertUciToAlgebraic(uciMove);
      
      const stockfishMove: StockfishMove = {
        move,
        score: score || 0,
        depth: depth || 0,
        time: Date.now()
      };

      if (this.moveResolve) {
        this.moveResolve(stockfishMove);
        this.moveResolve = null;
        this.moveReject = null;
      }
    }
  }

  private convertUciToAlgebraic(uciMove: string): string {
    try {
      // Use chess.js to convert UCI move to algebraic notation
      const move = this.chess.move(uciMove);
      if (move) {
        return move.san;
      }
    } catch (error) {
      // If chess.js fails, fall back to simple conversion
      console.error('Failed to convert UCI move:', uciMove, error);
    }

    // Fallback conversion
    // Handle special moves
    if (uciMove === 'e1g1' || uciMove === 'e1c1') {
      return uciMove === 'e1g1' ? 'O-O' : 'O-O-O';
    }
    if (uciMove === 'e8g8' || uciMove === 'e8c8') {
      return uciMove === 'e8g8' ? 'O-O' : 'O-O-O';
    }

    // Handle pawn promotion
    if (uciMove.length === 5) {
      const from = uciMove.substring(0, 2);
      const to = uciMove.substring(2, 4);
      const promotion = uciMove.substring(4, 5);
      return `${to}=${promotion.toUpperCase()}`;
    }

    // Regular moves - return destination square
    const to = uciMove.substring(2, 4);
    return to;
  }

  private extractScore(line: string): number | null {
    const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
    if (scoreMatch) {
      const type = scoreMatch[1];
      const value = parseInt(scoreMatch[2]);
      if (type === 'mate') {
        return value > 0 ? 10000 : -10000;
      }
      return value;
    }
    return null;
  }

  private extractDepth(line: string): number | null {
    const depthMatch = line.match(/depth (\d+)/);
    return depthMatch ? parseInt(depthMatch[1]) : null;
  }

  private sendCommand(command: string): void {
    if (this.process && this.process.stdin) {
      this.process.stdin.write(command + '\n');
    }
  }

  async setPosition(fen: string): Promise<void> {
    this.sendCommand(`position fen ${fen}`);
  }

  async setMoves(moves: string[]): Promise<void> {
    // Reset chess instance to match the position
    this.chess = new Chess();
    
    if (moves.length === 0) {
      this.sendCommand('position startpos');
    } else {
      // Convert algebraic moves to UCI format for Stockfish
      const uciMoves: string[] = [];
      
      moves.forEach(move => {
        try {
          const chessMove = this.chess.move(move);
          if (chessMove) {
            uciMoves.push(chessMove.from + chessMove.to + (chessMove.promotion || ''));
          }
        } catch (error) {
          console.error('Invalid move in history:', move);
        }
      });
      
      if (uciMoves.length > 0) {
        this.sendCommand(`position startpos moves ${uciMoves.join(' ')}`);
      } else {
        this.sendCommand('position startpos');
      }
    }
  }

  async getBestMove(depth: number = 15, timeLimit: number = 5000): Promise<StockfishMove> {
    return new Promise((resolve, reject) => {
      // Ensure engine is ready
      if (!this.isReady) {
        reject(new Error('Stockfish engine not ready'));
        return;
      }

      this.moveResolve = resolve;
      this.moveReject = reject;
      
      // Use a shorter depth and time limit for faster responses
      const actualDepth = Math.min(depth, 10);
      const actualTimeLimit = Math.min(timeLimit, 3000);
      
      this.sendCommand(`go depth ${actualDepth} movetime ${actualTimeLimit}`);
      
      // Timeout after timeLimit + 2 seconds
      setTimeout(() => {
        if (this.moveReject) {
          this.moveReject(new Error('Stockfish move timeout'));
          this.moveResolve = null;
          this.moveReject = null;
        }
      }, actualTimeLimit + 2000);
    });
  }

  async stop(): Promise<void> {
    this.sendCommand('stop');
  }

  async quit(): Promise<void> {
    this.sendCommand('quit');
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  isEngineReady(): boolean {
    return this.isReady;
  }
} 