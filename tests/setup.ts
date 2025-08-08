// Test setup file

// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock chalk to avoid color codes in test output
jest.mock('chalk', () => {
  const mockFn = (text: string) => text;
  mockFn.green = (text: string) => text;
  mockFn.red = (text: string) => text;
  mockFn.yellow = (text: string) => text;
  mockFn.blue = (text: string) => text;
  mockFn.cyan = (text: string) => text;
  mockFn.magenta = (text: string) => text;
  mockFn.white = (text: string) => text;
  mockFn.black = (text: string) => text;
  
  return {
    bold: {
      cyan: mockFn,
      green: mockFn,
      red: mockFn,
      yellow: mockFn,
      blue: mockFn,
      magenta: mockFn,
      white: mockFn,
    },
    white: mockFn,
    green: mockFn,
    red: mockFn,
    yellow: mockFn,
    blue: mockFn,
    cyan: mockFn,
    magenta: mockFn,
    black: mockFn,
    bgYellow: mockFn,
    bgGray: mockFn,
  };
});

// Mock inquirer to avoid interactive prompts in tests
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

// Increase timeout for integration tests
jest.setTimeout(10000); 