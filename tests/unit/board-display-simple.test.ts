import { Chess } from 'chess.js';
import { BoardDisplay } from '../../src/board-display';

// Mock chalk completely
jest.mock('chalk', () => ({
  bold: {
    cyan: jest.fn((text: string) => text),
    green: jest.fn((text: string) => text),
    red: jest.fn((text: string) => text),
    yellow: jest.fn((text: string) => text),
    blue: jest.fn((text: string) => text),
    magenta: jest.fn((text: string) => text),
    white: jest.fn((text: string) => text),
  },
  white: jest.fn((text: string) => text),
  green: jest.fn((text: string) => text),
  red: jest.fn((text: string) => text),
  yellow: jest.fn((text: string) => text),
  blue: jest.fn((text: string) => text),
  cyan: jest.fn((text: string) => text),
  magenta: jest.fn((text: string) => text),
  bgYellow: jest.fn((text: string) => text),
  bgGray: jest.fn((text: string) => text),
}));

describe('BoardDisplay Simple', () => {
  let chess: Chess;

  beforeEach(() => {
    chess = new Chess();
    // Mock console.log to avoid output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('displayBoard', () => {
    it('should not throw when displaying board', () => {
      expect(() => {
        BoardDisplay.displayBoard(chess, 'white');
      }).not.toThrow();
    });

    it('should not throw when displaying board for black perspective', () => {
      expect(() => {
        BoardDisplay.displayBoard(chess, 'black');
      }).not.toThrow();
    });
  });

  describe('displayGameInfo', () => {
    it('should not throw when displaying game info', () => {
      expect(() => {
        BoardDisplay.displayGameInfo(chess, 'white', 'black');
      }).not.toThrow();
    });

    it('should handle check position', () => {
      // Set up a position where white is in check
      chess.load('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1');
      chess.move('Qh5'); // Black queen to h5, checking white king
      
      expect(() => {
        BoardDisplay.displayGameInfo(chess, 'white', 'black');
      }).not.toThrow();
    });
  });

  describe('displayMoveHistory', () => {
    it('should handle empty move history', () => {
      expect(() => {
        BoardDisplay.displayMoveHistory([]);
      }).not.toThrow();
    });

    it('should handle move history with moves', () => {
      const moves = ['e4', 'e5', 'Nf3', 'Nc6'];
      expect(() => {
        BoardDisplay.displayMoveHistory(moves);
      }).not.toThrow();
    });

    it('should handle odd number of moves', () => {
      const moves = ['e4', 'e5', 'Nf3'];
      expect(() => {
        BoardDisplay.displayMoveHistory(moves);
      }).not.toThrow();
    });
  });

  describe('displayLegalMoves', () => {
    it('should display legal moves for initial position', () => {
      expect(() => {
        BoardDisplay.displayLegalMoves(chess);
      }).not.toThrow();
    });

    it('should handle checkmate position', () => {
      // Set up a checkmate position
      chess.load('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1');
      
      expect(() => {
        BoardDisplay.displayLegalMoves(chess);
      }).not.toThrow();
    });
  });

  describe('displayEvaluation', () => {
    it('should handle positive evaluation', () => {
      expect(() => {
        BoardDisplay.displayEvaluation(150);
      }).not.toThrow();
    });

    it('should handle negative evaluation', () => {
      expect(() => {
        BoardDisplay.displayEvaluation(-200);
      }).not.toThrow();
    });

    it('should handle mate evaluation', () => {
      expect(() => {
        BoardDisplay.displayEvaluation(10000);
      }).not.toThrow();
      
      expect(() => {
        BoardDisplay.displayEvaluation(-10000);
      }).not.toThrow();
    });

    it('should handle zero evaluation', () => {
      expect(() => {
        BoardDisplay.displayEvaluation(0);
      }).not.toThrow();
    });
  });
}); 