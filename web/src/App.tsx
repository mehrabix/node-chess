import React, { useState, useEffect } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import './App.css'

interface GameState {
  chess: Chess
  playerColor: 'white' | 'black'
  engineColor: 'white' | 'black'
  moveHistory: string[]
  gameMode: 'new' | 'continue' | 'gambit' | 'learning'
  learningMode?: boolean
  learningOpening?: any
  isEngineThinking: boolean
  gameStatus: string
  evaluation: number
}

interface Gambit {
  name: string
  description: string
  moves: string[]
  color: 'white' | 'black'
}

const GAMBITS: Gambit[] = [
  {
    name: "King's Gambit",
    description: "A classic attacking opening where White sacrifices a pawn for rapid development and attacking chances",
    color: "white",
    moves: ["e4", "e5", "f4"]
  },
  {
    name: "Queen's Gambit",
    description: "A positional opening where White offers a pawn to gain central control",
    color: "white",
    moves: ["d4", "d5", "c4"]
  },
  {
    name: "Ruy Lopez (Spanish Opening)",
    description: "One of the oldest and most respected openings, focusing on central control and piece development",
    color: "white",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"]
  },
  {
    name: "Sicilian Defense",
    description: "Black's most popular response to 1.e4, creating asymmetrical positions",
    color: "black",
    moves: ["e4", "c5"]
  }
]

function App() {
  const [gameState, setGameState] = useState<GameState>({
    chess: new Chess(),
    playerColor: 'white',
    engineColor: 'black',
    moveHistory: [],
    gameMode: 'new',
    isEngineThinking: false,
    gameStatus: 'Welcome to Chesster!',
    evaluation: 0
  })

  const [showModeSelection, setShowModeSelection] = useState(true)
  const [showOpeningSelection, setShowOpeningSelection] = useState(false)
  const [selectedOpening, setSelectedOpening] = useState<Gambit | null>(null)

  const makeAMove = (move: any) => {
    const gameCopy = new Chess(gameState.chess.fen())
    
    try {
      const result = gameCopy.move(move)
      if (result === null) return false
      
      setGameState(prev => ({
        ...prev,
        chess: gameCopy,
        moveHistory: [...prev.moveHistory, result.san]
      }))
      
      return true
    } catch (error) {
      return false
    }
  }

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to queen for simplicity
    })

    if (move && gameState.gameMode !== 'learning') {
      // Engine's turn
      setTimeout(() => {
        makeEngineMove()
      }, 500)
    }

    return move
  }

  const makeEngineMove = async () => {
    if (gameState.chess.isGameOver()) return

    setGameState(prev => ({ ...prev, isEngineThinking: true }))

    try {
      // Simulate engine move (in real implementation, this would call Stockfish)
      const legalMoves = gameState.chess.moves()
      if (legalMoves.length > 0) {
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]
        makeAMove(randomMove)
      }
    } catch (error) {
      console.error('Engine error:', error)
    } finally {
      setGameState(prev => ({ ...prev, isEngineThinking: false }))
    }
  }

  const startNewGame = (mode: 'new' | 'continue' | 'gambit' | 'learning') => {
    const newChess = new Chess()
    setGameState(prev => ({
      ...prev,
      chess: newChess,
      gameMode: mode,
      moveHistory: [],
      gameStatus: `New ${mode} game started`,
      evaluation: 0
    }))
    setShowModeSelection(false)
  }

  const selectOpening = (opening: Gambit) => {
    setSelectedOpening(opening)
    setShowOpeningSelection(false)
    
    // Apply opening moves
    const newChess = new Chess()
    const moves: string[] = []
    
    opening.moves.forEach(move => {
      try {
        const result = newChess.move(move)
        if (result) {
          moves.push(result.san)
        }
      } catch (error) {
        console.error('Invalid opening move:', move)
      }
    })
    
    setGameState(prev => ({
      ...prev,
      chess: newChess,
      moveHistory: moves,
      gameStatus: `Playing ${opening.name}`,
      learningOpening: opening
    }))
  }

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      chess: new Chess(),
      moveHistory: [],
      gameStatus: 'Game reset',
      evaluation: 0
    }))
    setShowModeSelection(true)
    setSelectedOpening(null)
  }

  const undoMove = () => {
    const newChess = new Chess(gameState.chess.fen())
    newChess.undo()
    newChess.undo() // Undo both player and engine moves
    
    setGameState(prev => ({
      ...prev,
      chess: newChess,
      moveHistory: prev.moveHistory.slice(0, -2)
    }))
  }

  useEffect(() => {
    // Update game status
    if (gameState.chess.isCheckmate()) {
      setGameState(prev => ({ ...prev, gameStatus: 'Checkmate!' }))
    } else if (gameState.chess.isDraw()) {
      setGameState(prev => ({ ...prev, gameStatus: 'Draw!' }))
    } else if (gameState.chess.isCheck()) {
      setGameState(prev => ({ ...prev, gameStatus: 'Check!' }))
    }
  }, [gameState.chess.fen()])

  return (
    <div className="app">
      <div className="header">
        <h1>♔ Chesster</h1>
        <p>Interactive Chess Game with Stockfish Engine</p>
      </div>

      {showModeSelection && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Game Mode</h2>
            <div className="controls">
              <button 
                className="btn btn-primary" 
                onClick={() => startNewGame('new')}
              >
                New Game
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => startNewGame('learning')}
              >
                Learning Mode
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowOpeningSelection(true)}
              >
                Play Gambit
              </button>
            </div>
          </div>
        </div>
      )}

      {showOpeningSelection && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Opening/Gambit</h2>
            <div className="controls">
              {GAMBITS.map((gambit, index) => (
                <button 
                  key={index}
                  className="btn btn-secondary" 
                  onClick={() => selectOpening(gambit)}
                >
                  {gambit.name}
                </button>
              ))}
              <button 
                className="btn btn-danger" 
                onClick={() => setShowOpeningSelection(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="game-container">
        <div className="chess-board">
          <Chessboard 
            position={gameState.chess.fen()}
            onPieceDrop={onDrop}
            boardOrientation={gameState.playerColor}
            customBoardStyle={{
              borderRadius: '8px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>

        <div className="game-info">
          <h3>Game Information</h3>
          
          <div className="info-section">
            <h4>Status</h4>
            <div className={`status ${gameState.isEngineThinking ? 'info' : 'success'}`}>
              {gameState.isEngineThinking ? 'Engine is thinking...' : gameState.gameStatus}
            </div>
          </div>

          <div className="info-section">
            <h4>Current Turn</h4>
            <p>{gameState.chess.turn() === 'w' ? 'White' : 'Black'}</p>
          </div>

          <div className="info-section">
            <h4>Move History</h4>
            <div className="move-history">
              {gameState.moveHistory.map((move, index) => (
                <div key={index} className="move">
                  <span>{Math.floor(index / 2) + 1}.</span>
                  <span>{move}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="controls">
            <button className="btn btn-primary" onClick={resetGame}>
              New Game
            </button>
            <button className="btn btn-secondary" onClick={undoMove}>
              Undo Move
            </button>
            {gameState.gameMode === 'learning' && (
              <button className="btn btn-secondary" onClick={() => makeEngineMove()}>
                Get Engine Suggestion
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 