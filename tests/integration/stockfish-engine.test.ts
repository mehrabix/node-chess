import { StockfishEngine } from '../../src/stockfish-engine';
import { spawn } from 'child_process';

// Mock child_process.spawn
jest.mock('child_process', () => ({
  spawn: jest.fn()
}));

describe('StockfishEngine Integration', () => {
  let engine: StockfishEngine;
  let mockProcess: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock process
    mockProcess = {
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      stdin: { write: jest.fn() },
      on: jest.fn(),
      kill: jest.fn()
    };
    
    (spawn as jest.Mock).mockReturnValue(mockProcess);
    engine = new StockfishEngine();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      // Mock stdout data
      mockProcess.stdout.on.mockImplementation((event: string, callback: any) => {
        if (event === 'data') {
          // Simulate Stockfish ready response
          setTimeout(() => callback('readyok\n'), 100);
        }
      });

      await expect(engine.initialize()).resolves.not.toThrow();
      expect(spawn).toHaveBeenCalledWith('C:\\Program Files\\stockfish\\stockfish-windows-x86-64-avx2.exe');
    });

    it('should handle initialization errors', async () => {
      mockProcess.on.mockImplementation((event: string, callback: any) => {
        if (event === 'error') {
          setTimeout(() => callback(new Error('Process error')), 100);
        }
      });

      await expect(engine.initialize()).rejects.toThrow('Failed to start Stockfish');
    });
  });

  describe('move generation', () => {
    beforeEach(async () => {
      // Setup engine as ready
      mockProcess.stdout.on.mockImplementation((event: string, callback: any) => {
        if (event === 'data') {
          setTimeout(() => callback('readyok\n'), 50);
        }
      });
      await engine.initialize();
    });

    it('should set position correctly', async () => {
      await engine.setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      
      expect(mockProcess.stdin.write).toHaveBeenCalledWith(
        'position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\n'
      );
    });

    it('should set moves correctly', async () => {
      await engine.setMoves(['e4', 'e5']);
      
      expect(mockProcess.stdin.write).toHaveBeenCalledWith(
        'position startpos moves e4 e5\n'
      );
    });

    it('should set empty moves correctly', async () => {
      await engine.setMoves([]);
      
      expect(mockProcess.stdin.write).toHaveBeenCalledWith(
        'position startpos\n'
      );
    });

    it('should get best move with score and depth', async () => {
      // Mock best move response
      mockProcess.stdout.on.mockImplementation((event: string, callback: any) => {
        if (event === 'data') {
          setTimeout(() => callback('bestmove e2e4 score cp 15 depth 15\n'), 100);
        }
      });

      const move = await engine.getBestMove(15, 1000);
      
      expect(move.move).toBe('e2e4');
      expect(move.score).toBe(15);
      expect(move.depth).toBe(15);
      expect(mockProcess.stdin.write).toHaveBeenCalledWith('go depth 15 movetime 1000\n');
    });

    it('should handle mate scores', async () => {
      // Mock mate response
      mockProcess.stdout.on.mockImplementation((event: string, callback: any) => {
        if (event === 'data') {
          setTimeout(() => callback('bestmove e2e4 score mate 3 depth 20\n'), 100);
        }
      });

      const move = await engine.getBestMove(20, 1000);
      
      expect(move.move).toBe('e2e4');
      expect(move.score).toBe(10000); // Mate for white
      expect(move.depth).toBe(20);
    });

    it('should handle negative mate scores', async () => {
      // Mock negative mate response
      mockProcess.stdout.on.mockImplementation((event: string, callback: any) => {
        if (event === 'data') {
          setTimeout(() => callback('bestmove e2e4 score mate -2 depth 20\n'), 100);
        }
      });

      const move = await engine.getBestMove(20, 1000);
      
      expect(move.move).toBe('e2e4');
      expect(move.score).toBe(-10000); // Mate for black
      expect(move.depth).toBe(20);
    });
  });

  describe('cleanup', () => {
    it('should quit and kill process', async () => {
      await engine.quit();
      
      expect(mockProcess.stdin.write).toHaveBeenCalledWith('quit\n');
      expect(mockProcess.kill).toHaveBeenCalled();
    });

    it('should stop engine', async () => {
      await engine.stop();
      
      expect(mockProcess.stdin.write).toHaveBeenCalledWith('stop\n');
    });
  });

  describe('error handling', () => {
    it('should handle move timeout', async () => {
      // Don't mock any response to simulate timeout
      mockProcess.stdout.on.mockImplementation(() => {});
      
      await expect(engine.getBestMove(10, 100)).rejects.toThrow('Stockfish move timeout');
    });

    it('should handle process errors', async () => {
      mockProcess.stderr.on.mockImplementation((event: string, callback: any) => {
        if (event === 'data') {
          callback('Error: Invalid command\n');
        }
      });

      // This should not throw but log the error
      await engine.initialize();
      expect(mockProcess.stderr.on).toHaveBeenCalledWith('data', expect.any(Function));
    });
  });

  describe('engine state', () => {
    it('should track ready state correctly', async () => {
      expect(engine.isEngineReady()).toBe(false);
      
      // Mock ready response
      mockProcess.stdout.on.mockImplementation((event: string, callback: any) => {
        if (event === 'data') {
          setTimeout(() => callback('readyok\n'), 50);
        }
      });
      
      await engine.initialize();
      expect(engine.isEngineReady()).toBe(true);
    });
  });
}); 