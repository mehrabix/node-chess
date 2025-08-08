import { Chess } from 'chess.js';
import { GAMBITS, getGambitsByColor, getGambitByName } from '../../src/gambits';

describe('Core Chess Functionality', () => {
  let chess: Chess;

  beforeEach(() => {
    chess = new Chess();
  });

  describe('Chess Game Logic', () => {
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
  });

  describe('Gambits Module', () => {
    it('should contain exactly 10 gambits', () => {
      expect(GAMBITS).toHaveLength(10);
    });

    it('should have valid gambit structure', () => {
      GAMBITS.forEach((gambit) => {
        expect(gambit).toHaveProperty('name');
        expect(gambit).toHaveProperty('description');
        expect(gambit).toHaveProperty('moves');
        expect(gambit).toHaveProperty('color');
        
        expect(typeof gambit.name).toBe('string');
        expect(typeof gambit.description).toBe('string');
        expect(Array.isArray(gambit.moves)).toBe(true);
        expect(['white', 'black']).toContain(gambit.color);
        
        expect(gambit.name.length).toBeGreaterThan(0);
        expect(gambit.description.length).toBeGreaterThan(0);
        expect(gambit.moves.length).toBeGreaterThan(0);
      });
    });

    it('should have unique names', () => {
      const names = GAMBITS.map(g => g.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('should return white gambits when color is white', () => {
      const whiteGambits = getGambitsByColor('white');
      expect(whiteGambits.length).toBeGreaterThan(0);
      whiteGambits.forEach(gambit => {
        expect(gambit.color).toBe('white');
      });
    });

    it('should return black gambits when color is black', () => {
      const blackGambits = getGambitsByColor('black');
      expect(blackGambits.length).toBeGreaterThan(0);
      blackGambits.forEach(gambit => {
        expect(gambit.color).toBe('black');
      });
    });

    it('should return correct gambit for valid name', () => {
      const kingsGambit = getGambitByName("King's Gambit");
      expect(kingsGambit).toBeDefined();
      expect(kingsGambit?.name).toBe("King's Gambit");
      expect(kingsGambit?.color).toBe('white');
    });

    it('should return undefined for invalid name', () => {
      const invalidGambit = getGambitByName('Invalid Gambit');
      expect(invalidGambit).toBeUndefined();
    });

    it('should have King\'s Gambit with correct moves', () => {
      const kingsGambit = getGambitByName("King's Gambit");
      expect(kingsGambit?.moves).toEqual(['e4', 'e5', 'f4']);
    });

    it('should have Queen\'s Gambit with correct moves', () => {
      const queensGambit = getGambitByName("Queen's Gambit");
      expect(queensGambit?.moves).toEqual(['d4', 'd5', 'c4']);
    });
  });

  describe('Game State Validation', () => {
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

    it('should handle move validation', () => {
      const legalMoves = chess.moves();
      
      // Test some common opening moves
      expect(legalMoves).toContain('e4');
      expect(legalMoves).toContain('d4');
      expect(legalMoves).toContain('Nf3');
      
      // Test that invalid moves are not in legal moves
      expect(legalMoves).not.toContain('e9');
      expect(legalMoves).not.toContain('Ke4');
    });
  });

  describe('Integration Tests', () => {
    it('should play a complete opening sequence', () => {
      const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'];
      
      moves.forEach(move => {
        const result = chess.move(move);
        expect(result).toBeDefined();
      });
      
      expect(chess.history()).toEqual(moves);
      expect(chess.history().length).toBe(6);
      expect(chess.turn()).toBe('w');
    });

    it('should handle gambit moves', () => {
      const kingsGambit = getGambitByName("King's Gambit");
      expect(kingsGambit).toBeDefined();
      
      if (kingsGambit) {
        kingsGambit.moves.forEach(move => {
          const result = chess.move(move);
          expect(result).toBeDefined();
        });
        
        expect(chess.history()).toEqual(kingsGambit.moves);
      }
    });

    it('should calculate game statistics correctly', () => {
      // Play some moves
      chess.move('e4');
      chess.move('e5');
      chess.move('Nf3');
      chess.move('Nc6');
      
      expect(chess.history().length).toBe(4);
      expect(Math.floor(chess.history().length / 2) + 1).toBe(3);
      expect(chess.turn()).toBe('w');
      expect(chess.isGameOver()).toBe(false);
    });
  });
}); 