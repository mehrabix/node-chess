import { Chess } from 'chess.js';
import { BoardDisplay } from '../../src/board-display';

// Mock console.log to capture output
const mockConsoleLog = jest.fn();
beforeEach(() => {
  mockConsoleLog.mockClear();
  console.log = mockConsoleLog;
});

describe('BoardDisplay', () => {
  let chess: Chess;

  beforeEach(() => {
    chess = new Chess();
    mockConsoleLog.mockClear();
  });

  describe('displayBoard', () => {
    it('should display board for white perspective', () => {
      BoardDisplay.displayBoard(chess, 'white');
      expect(mockConsoleLog).toHaveBeenCalled();
      
      const calls = mockConsoleLog.mock.calls;
      expect(calls.length).toBeGreaterThan(10); // Board has multiple lines
      
      // Check for board structure
      const output = calls.map(call => call[0]).join('\n');
      expect(output).toContain('a   b   c   d   e   f   g   h');
      expect(output).toContain('┌───┬───┬───┬───┬───┬───┬───┬───┐');
      expect(output).toContain('└───┴───┴───┴───┴───┴───┴───┴───┘');
    });

    it('should display board for black perspective', () => {
      BoardDisplay.displayBoard(chess, 'black');
      expect(mockConsoleLog).toHaveBeenCalled();
      
      const calls = mockConsoleLog.mock.calls;
      const output = calls.map(call => call[0]).join('\n');
      expect(output).toContain('h   g   f   e   d   c   b   a');
    });

    it('should display pieces correctly', () => {
      BoardDisplay.displayBoard(chess, 'white');
      const calls = mockConsoleLog.mock.calls;
      const output = calls.map(call => call[0]).join('\n');
      
      // Should contain piece symbols
      expect(output).toContain('♙'); // White pawn
      expect(output).toContain('♖'); // White rook
      expect(output).toContain('♘'); // White knight
      expect(output).toContain('♗'); // White bishop
      expect(output).toContain('♕'); // White queen
      expect(output).toContain('♔'); // White king
    });
  });

  describe('displayGameInfo', () => {
    it('should display game information correctly', () => {
      BoardDisplay.displayGameInfo(chess, 'white', 'black');
      expect(mockConsoleLog).toHaveBeenCalled();
      
      const calls = mockConsoleLog.mock.calls;
      const output = calls.map(call => call[0]).join('\n');
      
      expect(output).toContain('Game Information');
      expect(output).toContain('Player Color: WHITE');
      expect(output).toContain('Engine Color: BLACK');
      expect(output).toContain('Current Turn: WHITE');
      expect(output).toContain('Move Number: 1');
    });

    it('should show check status when in check', () => {
      // Set up a position where white is in check
      chess.load('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1');
      chess.move('Qh5'); // Black queen to h5, checking white king
      
      BoardDisplay.displayGameInfo(chess, 'white', 'black');
      const calls = mockConsoleLog.mock.calls;
      const output = calls.map(call => call[0]).join('\n');
      
      expect(output).toContain('CHECK!');
    });
  });

  describe('displayMoveHistory', () => {
    it('should display empty move history correctly', () => {
      BoardDisplay.displayMoveHistory([]);
      expect(mockConsoleLog).toHaveBeenCalledWith('No moves played yet.');
    });

    it('should display move history correctly', () => {
      const moves = ['e4', 'e5', 'Nf3', 'Nc6'];
      BoardDisplay.displayMoveHistory(moves);
      
      const calls = mockConsoleLog.mock.calls;
      const output = calls.map(call => call[0]).join('\n');
      
      expect(output).toContain('Move History');
      expect(output).toContain('1. e4 e5');
      expect(output).toContain('2. Nf3 Nc6');
    });

    it('should handle odd number of moves', () => {
      const moves = ['e4', 'e5', 'Nf3'];
      BoardDisplay.displayMoveHistory(moves);
      
      const calls = mockConsoleLog.mock.calls;
      const output = calls.map(call => call[0]).join('\n');
      
      expect(output).toContain('1. e4 e5');
      expect(output).toContain('2. Nf3');
    });
  });

  describe('displayLegalMoves', () => {
    it('should display legal moves correctly', () => {
      BoardDisplay.displayLegalMoves(chess);
      
      const calls = mockConsoleLog.mock.calls;
      const output = calls.map(call => call[0]).join('\n');
      
      expect(output).toContain('Legal Moves');
      // Should contain some common opening moves
      expect(output).toContain('e4');
      expect(output).toContain('d4');
      expect(output).toContain('Nf3');
    });

    it('should handle no legal moves', () => {
      // Set up a checkmate position
      chess.load('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1');
      
      BoardDisplay.displayLegalMoves(chess);
      expect(mockConsoleLog).toHaveBeenCalledWith('No legal moves available.');
    });
  });

  describe('displayEvaluation', () => {
    it('should display positive evaluation correctly', () => {
      BoardDisplay.displayEvaluation(150);
      expect(mockConsoleLog).toHaveBeenCalledWith('Evaluation: +1.5 (White ahead)');
    });

    it('should display negative evaluation correctly', () => {
      BoardDisplay.displayEvaluation(-200);
      expect(mockConsoleLog).toHaveBeenCalledWith('Evaluation: -2.0 (Black ahead)');
    });

    it('should display mate evaluation correctly', () => {
      BoardDisplay.displayEvaluation(10000);
      expect(mockConsoleLog).toHaveBeenCalledWith('Evaluation: Mate for White');
      
      BoardDisplay.displayEvaluation(-10000);
      expect(mockConsoleLog).toHaveBeenCalledWith('Evaluation: Mate for Black');
    });

    it('should handle zero evaluation', () => {
      BoardDisplay.displayEvaluation(0);
      expect(mockConsoleLog).toHaveBeenCalledWith('Evaluation: 0.0 (Black ahead)');
    });
  });
}); 