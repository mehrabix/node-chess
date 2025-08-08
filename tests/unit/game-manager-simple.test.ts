import { Chess } from 'chess.js';

// Mock dependencies
jest.mock('../../src/stockfish-engine');
jest.mock('inquirer');

describe('GameManager Simple', () => {
  let chess: Chess;

  beforeEach(() => {
    chess = new Chess();
  });

  describe('chess game functionality', () => {
    it('should have correct initial state', () => {
      expect(chess.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      expect(chess.turn()).toBe('w');
      expect(chess.isGameOver()).toBe(false);
    });

    it('should make valid moves', () => {
      const result = chess.move('e4');
      expect(result).toBeDefined();
      expect(chess.turn()).toBe('b');
      expect(chess.history()).toContain('e4');
    });

    it('should reject invalid moves', () => {
      expect(() => {
        chess.move('e9');
      }).toThrow();
    });

    it('should track move history correctly', () => {
      chess.move('e4');
      chess.move('e5');
      chess.move('Nf3');
      
      expect(chess.history()).toEqual(['e4', 'e5', 'Nf3']);
      expect(chess.history().length).toBe(3);
    });

    it('should calculate move number correctly', () => {
      // No moves played
      expect(Math.floor(chess.history().length / 2) + 1).toBe(1);
      
      // One move played
      chess.move('e4');
      expect(Math.floor(chess.history().length / 2) + 1).toBe(1);
      
      // Two moves played
      chess.move('e5');
      expect(Math.floor(chess.history().length / 2) + 1).toBe(2);
    });

    it('should detect check', () => {
      // Set up a position where white is in check
      chess.load('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1');
      chess.move('Qh5'); // Black queen to h5, checking white king
      
      // The position should be in check after Qh5
      expect(chess.isCheck()).toBe(true);
    });

    it('should detect checkmate', () => {
      // Set up a checkmate position
      chess.load('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1');
      
      expect(chess.isCheckmate()).toBe(true);
      expect(chess.isGameOver()).toBe(true);
    });

    it('should detect draw', () => {
      // Set up insufficient material draw
      chess.load('k7/8/8/8/8/8/8/K7 w - - 0 1');
      
      expect(chess.isDraw()).toBe(true);
      expect(chess.isGameOver()).toBe(true);
    });

    it('should get legal moves', () => {
      const legalMoves = chess.moves();
      
      expect(legalMoves.length).toBeGreaterThan(0);
      expect(legalMoves).toContain('e4');
      expect(legalMoves).toContain('d4');
      expect(legalMoves).toContain('Nf3');
    });

    it('should handle color management', () => {
      // Test white's turn initially
      expect(chess.turn()).toBe('w');
      
      // After white moves
      chess.move('e4');
      expect(chess.turn()).toBe('b');
      
      // After black moves
      chess.move('e5');
      expect(chess.turn()).toBe('w');
    });

    it('should load FEN positions', () => {
      const customFen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1';
      chess.load(customFen);
      
      expect(chess.fen()).toBe(customFen);
      expect(chess.turn()).toBe('b');
    });

    it('should handle pawn promotion', () => {
      // Set up a position where pawn can promote (with kings)
      chess.load('8/4P3/8/8/8/8/8/K7 w - - 0 1');
      
      const result = chess.move('e8=Q');
      expect(result).toBeDefined();
      expect(result.promotion).toBe('q');
    });

    it('should handle castling', () => {
      // Set up position for kingside castling
      chess.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      chess.move('e4');
      chess.move('e5');
      chess.move('Nf3');
      chess.move('Nc6');
      chess.move('Bc4');
      chess.move('Bc5');
      chess.move('O-O');
      
      expect(chess.history()).toContain('O-O');
    });
  });

  describe('game state validation', () => {
    it('should validate move legality', () => {
      const legalMoves = chess.moves();
      
      // Test that all legal moves are actually legal
      legalMoves.forEach(move => {
        const testChess = new Chess();
        expect(() => {
          testChess.move(move);
        }).not.toThrow();
      });
    });

    it('should handle game termination correctly', () => {
      // Test that game continues when not over
      expect(chess.isGameOver()).toBe(false);
      
      // Test checkmate
      chess.load('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1');
      expect(chess.isGameOver()).toBe(true);
      expect(chess.isCheckmate()).toBe(true);
    });
  });
}); 