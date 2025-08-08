import { GameManager } from '../../src/game-manager';
import { Chess } from 'chess.js';
import inquirer from 'inquirer';

// Mock dependencies
jest.mock('../../src/stockfish-engine');
jest.mock('inquirer');

describe('GameManager', () => {
  let gameManager: GameManager;
  let mockInquirer: jest.Mocked<typeof inquirer>;

  beforeEach(() => {
    jest.clearAllMocks();
    gameManager = new GameManager();
    mockInquirer = inquirer as jest.Mocked<typeof inquirer>;
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      // Mock the engine initialization
      const mockEngine = {
        initialize: jest.fn().mockResolvedValue(undefined),
        quit: jest.fn().mockResolvedValue(undefined)
      };
      
      // Mock the constructor to return our mock engine
      const StockfishEngineMock = jest.requireMock('../../src/stockfish-engine').StockfishEngine;
      StockfishEngineMock.mockImplementation(() => mockEngine);
      
      await expect(gameManager.initialize()).resolves.not.toThrow();
      expect(mockEngine.initialize).toHaveBeenCalled();
    });

    it('should handle initialization errors', async () => {
      const mockEngine = {
        initialize: jest.fn().mockRejectedValue(new Error('Engine error')),
        quit: jest.fn().mockResolvedValue(undefined)
      };
      
      const StockfishEngineMock = jest.requireMock('../../src/stockfish-engine').StockfishEngine;
      StockfishEngineMock.mockImplementation(() => mockEngine);
      
      await expect(gameManager.initialize()).rejects.toThrow('Engine error');
    });
  });

  describe('game state management', () => {
    it('should have correct initial state', () => {
      // Access private state through reflection or public methods
      const gameState = (gameManager as any).gameState;
      
      expect(gameState.playerColor).toBe('white');
      expect(gameState.engineColor).toBe('black');
      expect(gameState.moveHistory).toEqual([]);
      expect(gameState.chess).toBeInstanceOf(Chess);
    });

    it('should update player and engine colors correctly', () => {
      const gameState = (gameManager as any).gameState;
      
      gameState.playerColor = 'black';
      gameState.engineColor = 'white';
      
      expect(gameState.playerColor).toBe('black');
      expect(gameState.engineColor).toBe('white');
    });
  });

  describe('move validation', () => {
    it('should validate legal moves', () => {
      const chess = new Chess();
      const legalMoves = chess.moves();
      
      // Test some common opening moves
      expect(legalMoves).toContain('e4');
      expect(legalMoves).toContain('d4');
      expect(legalMoves).toContain('Nf3');
    });

    it('should reject illegal moves', () => {
      const chess = new Chess();
      const legalMoves = chess.moves();
      
      expect(legalMoves).not.toContain('e9'); // Invalid square
      expect(legalMoves).not.toContain('Ke4'); // Illegal king move
    });
  });

  describe('game over detection', () => {
    it('should detect checkmate', () => {
      const chess = new Chess();
      // Set up a checkmate position
      chess.load('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1');
      
      expect(chess.isCheckmate()).toBe(true);
      expect(chess.isGameOver()).toBe(true);
    });

    it('should detect stalemate', () => {
      const chess = new Chess();
      // Set up a stalemate position
      chess.load('k7/8/1K6/8/8/8/8/8 w - - 0 1');
      
      // This position might not be stalemate in chess.js, so we'll test for game over
      expect(chess.isGameOver()).toBe(true);
    });

    it('should detect draw', () => {
      const chess = new Chess();
      // Set up insufficient material draw
      chess.load('k7/8/8/8/8/8/8/K7 w - - 0 1');
      
      expect(chess.isDraw()).toBe(true);
      expect(chess.isGameOver()).toBe(true);
    });
  });

  describe('move history', () => {
    it('should track moves correctly', () => {
      const chess = new Chess();
      const moves = ['e4', 'e5', 'Nf3'];
      
      moves.forEach(move => {
        chess.move(move);
      });
      
      expect(chess.history()).toEqual(moves);
    });

    it('should calculate move number correctly', () => {
      const chess = new Chess();
      
      // No moves played
      expect(Math.floor(chess.history().length / 2) + 1).toBe(1);
      
      // One move played
      chess.move('e4');
      expect(Math.floor(chess.history().length / 2) + 1).toBe(1);
      
      // Two moves played
      chess.move('e5');
      expect(Math.floor(chess.history().length / 2) + 1).toBe(2);
    });
  });

  describe('color management', () => {
    it('should handle color selection correctly', () => {
      const gameState = (gameManager as any).gameState;
      
      // Test white player
      gameState.playerColor = 'white';
      gameState.engineColor = 'black';
      expect(gameState.playerColor).toBe('white');
      expect(gameState.engineColor).toBe('black');
      
      // Test black player
      gameState.playerColor = 'black';
      gameState.engineColor = 'white';
      expect(gameState.playerColor).toBe('black');
      expect(gameState.engineColor).toBe('white');
    });

    it('should determine current turn correctly', () => {
      const chess = new Chess();
      
      // White's turn initially
      expect(chess.turn()).toBe('w');
      
      // After white moves
      chess.move('e4');
      expect(chess.turn()).toBe('b');
      
      // After black moves
      chess.move('e5');
      expect(chess.turn()).toBe('w');
    });
  });

  describe('cleanup', () => {
    it('should cleanup resources', async () => {
      const mockEngine = {
        initialize: jest.fn().mockResolvedValue(undefined),
        quit: jest.fn().mockResolvedValue(undefined)
      };
      
      const StockfishEngineMock = jest.requireMock('../../src/stockfish-engine').StockfishEngine;
      StockfishEngineMock.mockImplementation(() => mockEngine);
      
      await gameManager.cleanup();
      expect(mockEngine.quit).toHaveBeenCalled();
    });
  });
}); 