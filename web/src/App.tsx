import React, { useState, useEffect, useCallback } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { GAMBITS } from '../../src/gambits'
import './App.css'

interface Gambit {
  name: string
  description: string
  moves: string[]
  color: 'white' | 'black'
}

interface GameState {
  chess: Chess
  playerColor: 'white' | 'black'
  engineColor: 'white' | 'black'
  moveHistory: string[]
  gameMode: 'new' | 'continue' | 'gambit' | 'learning'
  learningMode?: boolean
  learningOpening?: Gambit
  selectedGambit?: Gambit
  isEngineThinking: boolean
  gameStatus: string
  evaluation: number
  engineSuggestion?: {
    move: string
    score: number
    depth: number
  }
  openingSuggestion?: {
    name: string
    expectedMove: string
    moveNumber: number
    isLegal: boolean
  }
}

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
  const [showContinueGame, setShowContinueGame] = useState(false)
  const [showLearningSetup, setShowLearningSetup] = useState(false)
  const [moveInput, setMoveInput] = useState('')
  const [moveError, setMoveError] = useState('')
  const [continueMoves, setContinueMoves] = useState('')
  const [continueColor, setContinueColor] = useState<'white' | 'black'>('white')
  const [isMobile, setIsMobile] = useState(false)

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const makeAMove = useCallback((move: any) => {
    const gameCopy = new Chess(gameState.chess.fen())
    
    try {
      const result = gameCopy.move(move)
      if (result === null) return false
      
      setGameState(prev => ({
        ...prev,
        chess: gameCopy,
        moveHistory: [...prev.moveHistory, result.san],
        // Clear engine suggestion when a new move is made
        engineSuggestion: undefined
      }))
      
      return true
    } catch (error) {
      return false
    }
  }, [gameState.chess.fen()])

  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    // Check if the move is legal for the current turn
    const gameCopy = new Chess(gameState.chess.fen())
    const legalMoves = gameCopy.moves({ verbose: true })
    
    // Find if this move is legal
    const isLegalMove = legalMoves.some(legalMove => 
      legalMove.from === sourceSquare && legalMove.to === targetSquare
    )
    
    if (!isLegalMove) {
      return false // Invalid move for current turn
    }
    
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    })

    if (move) {
      if (gameState.gameMode !== 'learning') {
        // Normal game mode - engine responds
        setTimeout(() => {
          makeEngineMove()
        }, 500)
      }
      // In learning mode, no auto-response - player controls both colors
    }

    return move
  }, [makeAMove, gameState.gameMode, gameState.chess.fen()])

  const handleMoveInput = useCallback(() => {
    const legalMoves = gameState.chess.moves()
    const inputMove = moveInput.trim()
    
    if (!inputMove) {
      setMoveError('Move cannot be empty')
      return
    }
    
    if (!legalMoves.includes(inputMove)) {
      const currentTurn = gameState.chess.turn() === 'w' ? 'White' : 'Black'
      setMoveError(`Invalid move for ${currentTurn}'s turn. Legal moves: ${legalMoves.join(', ')}`)
      return
    }
    
    setMoveError('')
    const success = makeAMove(inputMove)
    
    if (success) {
      setMoveInput('')
      if (gameState.gameMode !== 'learning') {
        // Normal game mode - engine responds
        setTimeout(() => {
          makeEngineMove()
        }, 500)
      }
      // In learning mode, no auto-response - player controls both colors
    }
  }, [moveInput, gameState.chess, gameState.gameMode, makeAMove])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleMoveInput()
    }
  }, [handleMoveInput])

  const makeEngineMove = useCallback(async () => {
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
  }, [gameState.chess, makeAMove])

  const getEngineSuggestion = useCallback(async () => {
    if (gameState.chess.isGameOver()) return

    setGameState(prev => ({ ...prev, isEngineThinking: true }))

    try {
      // Simulate engine analysis (in real implementation, this would call Stockfish)
      const legalMoves = gameState.chess.moves()
      if (legalMoves.length > 0) {
        const bestMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]
        const score = Math.floor(Math.random() * 200) - 100
        const depth = Math.floor(Math.random() * 10) + 10
        const currentTurn = gameState.chess.turn() === 'w' ? 'White' : 'Black'
        
        setGameState(prev => ({
          ...prev,
          engineSuggestion: {
            move: bestMove,
            score: score,
            depth: depth
          },
          gameStatus: `Engine analyzed position for ${currentTurn}`
        }))
      }
    } catch (error) {
      console.error('Engine error:', error)
      setGameState(prev => ({ ...prev, gameStatus: 'Engine analysis failed' }))
    } finally {
      setGameState(prev => ({ ...prev, isEngineThinking: false }))
    }
  }, [gameState.chess])

  const startNewGame = useCallback((mode: 'new' | 'continue' | 'gambit' | 'learning') => {
    if (mode === 'continue') {
      setShowContinueGame(true)
      return
    }
    
    if (mode === 'learning') {
      setShowLearningSetup(true)
      return
    }

    const newChess = new Chess()
    setGameState(prev => ({
      ...prev,
      chess: newChess,
      gameMode: mode,
      moveHistory: [],
      gameStatus: `New ${mode} game started`,
      evaluation: 0,
      engineSuggestion: undefined,
      openingSuggestion: undefined,
      learningMode: false,
      selectedGambit: undefined,
      learningOpening: undefined
    }))
    setShowModeSelection(false)
  }, [])

  const continueGame = useCallback(() => {
    const newChess = new Chess()
    const moves: string[] = []
    
    if (continueMoves.trim()) {
      const moveList = continueMoves.trim().split(/\s+/)
      for (const move of moveList) {
        try {
          newChess.move(move)
          moves.push(move)
        } catch (error) {
          setMoveError(`Invalid move: ${move}`)
          return
        }
      }
    }
    
    setGameState(prev => ({
      ...prev,
      chess: newChess,
      playerColor: continueColor,
      engineColor: continueColor === 'white' ? 'black' : 'white',
      gameMode: 'continue',
      moveHistory: moves,
      gameStatus: `Continuing game from position`,
      evaluation: 0
    }))
    
    setShowContinueGame(false)
    setShowModeSelection(false)
    setMoveError('')
  }, [continueMoves, continueColor])

  const selectOpening = useCallback((opening: Gambit) => {
    setShowOpeningSelection(false)
    setShowLearningSetup(false)
    
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
      learningOpening: opening,
      learningMode: true,
      gameMode: 'learning',
      playerColor: 'white', // Doesn't matter in learning mode
      engineColor: 'black'  // Doesn't matter in learning mode
    }))
  }, [])

  const startLearningMode = useCallback((followOpening: boolean) => {
    if (followOpening) {
      setShowOpeningSelection(true)
    } else {
      setGameState(prev => ({
        ...prev,
        learningMode: true,
        gameMode: 'learning',
        gameStatus: 'Learning mode activated - you control both colors',
        chess: new Chess(),
        moveHistory: [],
        evaluation: 0,
        engineSuggestion: undefined,
        openingSuggestion: undefined,
        selectedGambit: undefined,
        learningOpening: undefined,
        playerColor: 'white', // Doesn't matter in learning mode
        engineColor: 'black'  // Doesn't matter in learning mode
      }))
      setShowLearningSetup(false)
      setShowModeSelection(false)
    }
  }, [])

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      chess: new Chess(),
      moveHistory: [],
      gameStatus: 'Game reset',
      evaluation: 0,
      engineSuggestion: undefined,
      openingSuggestion: undefined,
      learningMode: false,
      selectedGambit: undefined,
      learningOpening: undefined
    }))
    setShowModeSelection(true)
    setMoveInput('')
    setMoveError('')
    setContinueMoves('')
  }, [])

  const undoMove = useCallback(() => {
    const newChess = new Chess(gameState.chess.fen())
    newChess.undo()
    if (gameState.gameMode !== 'learning') {
      newChess.undo() // Undo both player and engine moves
    }
    
    setGameState(prev => ({
      ...prev,
      chess: newChess,
      moveHistory: prev.moveHistory.slice(0, -1)
    }))
  }, [gameState.chess.fen(), gameState.gameMode])

  useEffect(() => {
    // Update game status
    if (gameState.chess.isCheckmate()) {
      const winner = gameState.chess.turn() === 'w' ? 'Black' : 'White'
      setGameState(prev => ({ ...prev, gameStatus: `Checkmate! ${winner} wins!` }))
    } else if (gameState.chess.isDraw()) {
      setGameState(prev => ({ ...prev, gameStatus: 'Game is a draw!' }))
    } else if (gameState.chess.isStalemate()) {
      setGameState(prev => ({ ...prev, gameStatus: 'Stalemate!' }))
    } else if (gameState.chess.isCheck()) {
      setGameState(prev => ({ ...prev, gameStatus: 'Check!' }))
    } else if (gameState.learningMode) {
      // In learning mode, show whose turn it is
      const currentTurn = gameState.chess.turn() === 'w' ? 'White' : 'Black'
      setGameState(prev => ({ ...prev, gameStatus: `${currentTurn} to move` }))
    }

    // Update opening suggestion in learning mode
    if (gameState.learningMode && gameState.learningOpening) {
      const opening = gameState.learningOpening
      const moveIndex = gameState.moveHistory.length
      
      if (moveIndex < opening.moves.length) {
        const expectedMove = opening.moves[moveIndex]
        const legalMoves = gameState.chess.moves()
        const isLegal = legalMoves.includes(expectedMove)
        
        setGameState(prev => ({
          ...prev,
          openingSuggestion: {
            name: opening.name,
            expectedMove: expectedMove,
            moveNumber: moveIndex + 1,
            isLegal: isLegal
          }
        }))
      } else {
        setGameState(prev => ({
          ...prev,
          openingSuggestion: undefined
        }))
      }
    }
  }, [gameState.chess.fen(), gameState.moveHistory.length, gameState.learningMode, gameState.learningOpening])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModeSelection(false)
        setShowOpeningSelection(false)
        setShowContinueGame(false)
        setShowLearningSetup(false)
      }
      
      if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        resetGame()
      }
      
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        undoMove()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resetGame, undoMove])

  return (
    <div className="app">
      <div className="header">
        <h1>♔ Chesster</h1>
        <p>Interactive Chess Game with Stockfish Engine</p>
        {isMobile && (
          <div className="mobile-hint">
            <small>💡 Tap and drag pieces to move them</small>
          </div>
        )}
      </div>

      {/* Mode Selection Modal */}
      {showModeSelection && (
        <div className="modal" role="dialog" aria-labelledby="mode-selection-title">
          <div className="modal-content">
            <h2 id="mode-selection-title">🎮 Select Game Mode</h2>
            <div className="mode-grid">
              <button 
                className="mode-card"
                onClick={() => startNewGame('new')}
                aria-label="Start a new game against Stockfish"
              >
                <div className="mode-icon">🆕</div>
                <h3>New Game</h3>
                <p>Start a fresh game against Stockfish</p>
              </button>
              
              <button 
                className="mode-card"
                onClick={() => startNewGame('continue')}
                aria-label="Continue an existing game"
              >
                <div className="mode-icon">📝</div>
                <h3>Continue Game</h3>
                <p>Enter existing moves and continue playing</p>
              </button>
              
              <button 
                className="mode-card"
                onClick={() => startNewGame('gambit')}
                aria-label="Play with predefined opening gambits"
              >
                <div className="mode-icon">🎯</div>
                <h3>Play Gambit</h3>
                <p>Play with predefined opening gambits</p>
              </button>
              
              <button 
                className="mode-card"
                onClick={() => startNewGame('learning')}
                aria-label="Control both colors with engine suggestions"
              >
                <div className="mode-icon">📚</div>
                <h3>Learning Mode</h3>
                <p>Control both colors with engine suggestions</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Continue Game Modal */}
      {showContinueGame && (
        <div className="modal" role="dialog" aria-labelledby="continue-game-title">
          <div className="modal-content">
            <h2 id="continue-game-title">📝 Continue Game</h2>
            <div className="form-group">
              <label htmlFor="continue-moves">Enter moves played so far:</label>
              <input
                id="continue-moves"
                type="text"
                value={continueMoves}
                onChange={(e) => setContinueMoves(e.target.value)}
                placeholder="e.g., e4 e5 Nf3 Nc6"
                className="form-input"
                aria-describedby="continue-moves-help"
              />
              <small id="continue-moves-help" className="form-help">
                Enter moves in algebraic notation, separated by spaces
              </small>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>What color are you playing?</legend>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="white"
                      checked={continueColor === 'white'}
                      onChange={(e) => setContinueColor(e.target.value as 'white' | 'black')}
                    />
                    White
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="black"
                      checked={continueColor === 'black'}
                      onChange={(e) => setContinueColor(e.target.value as 'white' | 'black')}
                    />
                    Black
                  </label>
                </div>
              </fieldset>
            </div>
            {moveError && <div className="error-message" role="alert">{moveError}</div>}
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={continueGame}>
                Continue Game
              </button>
              <button className="btn btn-secondary" onClick={() => setShowContinueGame(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Learning Setup Modal */}
      {showLearningSetup && (
        <div className="modal" role="dialog" aria-labelledby="learning-setup-title">
          <div className="modal-content">
            <h2 id="learning-setup-title">📚 Learning Mode Setup</h2>
            <p>You control both colors. The engine will suggest the best move for each position.</p>
            <div className="learning-options">
              <button 
                className="btn btn-primary"
                onClick={() => startLearningMode(true)}
                aria-label="Follow a specific opening"
              >
                📖 Follow Specific Opening
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => startLearningMode(false)}
                aria-label="Play freely without following an opening"
              >
                🆓 Play Freely
              </button>
            </div>
            <button 
              className="btn btn-danger"
              onClick={() => setShowLearningSetup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Opening Selection Modal */}
      {showOpeningSelection && (
        <div className="modal" role="dialog" aria-labelledby="opening-selection-title">
          <div className="modal-content">
            <h2 id="opening-selection-title">🎯 Select Opening/Gambit</h2>
            <div className="opening-grid">
              {GAMBITS.map((gambit: Gambit, index: number) => (
                <button 
                  key={index}
                  className="opening-card"
                  onClick={() => selectOpening(gambit)}
                  aria-label={`Select ${gambit.name} opening`}
                >
                  <h4>{gambit.name}</h4>
                  <p>{gambit.description}</p>
                  <div className="opening-moves">
                    <strong>Moves:</strong> {gambit.moves.join(' ')}
                  </div>
                  <div className="opening-color">
                    {gambit.color === 'white' ? '⚪ White' : '⚫ Black'}
                  </div>
                </button>
              ))}
            </div>
            <button 
              className="btn btn-danger"
              onClick={() => setShowOpeningSelection(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="game-container">
        <div className="chess-board">
          <Chessboard 
            position={gameState.chess.fen()}
            onPieceDrop={onDrop}
            boardOrientation={gameState.learningMode ? 'white' : gameState.playerColor}
            customBoardStyle={{
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}
            customDarkSquareStyle={{ backgroundColor: '#B58863' }}
            customLightSquareStyle={{ backgroundColor: '#F0D9B5' }}
          />
          {gameState.learningMode && (
            <div className={`board-turn-indicator ${gameState.chess.turn() === 'w' ? 'white-turn' : 'black-turn'}`}>
              <div className="turn-text">
                {gameState.chess.turn() === 'w' ? '⚪ White' : '⚫ Black'} to move
              </div>
            </div>
          )}
        </div>

        <div className="game-info">
          <h3>📊 Game Information</h3>
          
          <div className="info-section">
            <h4>📈 Status</h4>
            <div className={`status ${gameState.isEngineThinking ? 'info' : 'success'}`}>
              {gameState.isEngineThinking ? '🤔 Engine is thinking...' : gameState.gameStatus}
            </div>
          </div>

          <div className="info-section">
            <h4>🔄 Current Turn</h4>
            <div className={`turn-indicator ${gameState.chess.turn() === 'w' ? 'white-turn' : 'black-turn'}`}>
              <div className="turn-color">
                {gameState.chess.turn() === 'w' ? '⚪ White' : '⚫ Black'}
              </div>
              {gameState.learningMode && (
                <div className="learning-mode-hint">
                  <small>💡 You control both colors - make moves for {gameState.chess.turn() === 'w' ? 'White' : 'Black'}</small>
                </div>
              )}
            </div>
          </div>

          {/* Engine Suggestion (Learning Mode) */}
          {gameState.learningMode && (
            <div className="info-section">
              <h4>💡 Engine Analysis</h4>
              {gameState.engineSuggestion ? (
                <div className="engine-suggestion">
                  <div className="suggestion-move">
                    <strong>Best move:</strong> {gameState.engineSuggestion.move}
                  </div>
                  <div className="suggestion-details">
                    <span>Score: {gameState.engineSuggestion.score}</span>
                    <span>Depth: {gameState.engineSuggestion.depth}</span>
                  </div>
                  <div className="suggestion-evaluation">
                    {gameState.engineSuggestion.score > 100 ? (
                      <span className="winning">White is winning</span>
                    ) : gameState.engineSuggestion.score < -100 ? (
                      <span className="losing">Black is winning</span>
                    ) : (
                      <span className="equal">Position is roughly equal</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="engine-prompt">
                  <p>Click the button below to get engine analysis for the current position.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={getEngineSuggestion}
                    disabled={gameState.isEngineThinking || gameState.chess.isGameOver()}
                  >
                    {gameState.isEngineThinking ? '🤔 Analyzing...' : '💡 Get Engine Suggestion'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Opening Suggestion (Learning Mode) */}
          {gameState.learningMode && gameState.openingSuggestion && (
            <div className="info-section">
              <h4>📖 Opening Study</h4>
              <div className="opening-suggestion">
                <div className="opening-name">
                  {gameState.openingSuggestion.name} - Move {gameState.openingSuggestion.moveNumber}
                </div>
                <div className="expected-move">
                  <strong>Expected move:</strong> {gameState.openingSuggestion.expectedMove}
                </div>
                <div className={`opening-status ${gameState.openingSuggestion.isLegal ? 'legal' : 'illegal'}`}>
                  {gameState.openingSuggestion.isLegal ? '✅ Legal and follows opening' : '⚠️ Not legal in current position'}
                </div>
              </div>
            </div>
          )}

          {/* Move Input Section */}
          <div className="info-section">
            <h4>⌨️ Enter Move (CLI Style)</h4>
            <div className="move-input-container">
              <input
                type="text"
                value={moveInput}
                onChange={(e) => setMoveInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter move (e.g., e4, Nf3, O-O)"
                className="move-input"
                disabled={gameState.isEngineThinking || gameState.chess.isGameOver()}
                aria-label="Enter chess move"
                aria-describedby="legal-moves-help"
              />
              <button 
                onClick={handleMoveInput}
                className="btn btn-primary move-submit"
                disabled={gameState.isEngineThinking || gameState.chess.isGameOver()}
                aria-label="Submit move"
              >
                ▶️ Submit
              </button>
            </div>
            {moveError && <div className="error-message" role="alert">{moveError}</div>}
            <div className="legal-moves" id="legal-moves-help">
              <strong>✅ Legal moves for {gameState.chess.turn() === 'w' ? 'White' : 'Black'}:</strong> {gameState.chess.moves().join(', ')}
            </div>
          </div>

          <div className="info-section">
            <h4>📜 Move History</h4>
            <div className="move-history">
              {gameState.moveHistory.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
                  No moves played yet
                </p>
              ) : (
                gameState.moveHistory.map((move, index) => (
                  <div key={index} className="move">
                    <span>{Math.floor(index / 2) + 1}.</span>
                    <span>{move}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="controls">
            <button className="btn btn-primary" onClick={resetGame} aria-label="Start a new game">
              🆕 New Game
            </button>
            <button className="btn btn-secondary" onClick={undoMove} aria-label="Undo last move">
              ↩️ Undo Move
            </button>
            {gameState.learningMode && !gameState.engineSuggestion && (
              <button 
                className="btn btn-secondary" 
                onClick={getEngineSuggestion} 
                aria-label="Get engine suggestion"
                disabled={gameState.isEngineThinking || gameState.chess.isGameOver()}
              >
                💡 Analyze Position
              </button>
            )}
          </div>
          
          {/* Keyboard Shortcuts Help */}
          <div className="info-section">
            <h4>⌨️ Keyboard Shortcuts</h4>
            <div className="shortcuts-help">
              <p><kbd>Ctrl/Cmd + Z</kbd> Undo move</p>
              <p><kbd>Ctrl/Cmd + R</kbd> Reset game</p>
              <p><kbd>Escape</kbd> Close modals</p>
              <p><kbd>Enter</kbd> Submit move</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 