# Chesster - Interactive Chess Game

A Node.js TypeScript chess game that allows you to play against the Stockfish chess engine with an interactive CLI interface.

## Features

### CLI Mode
- 🎮 **Interactive CLI Interface** - Beautiful command-line interface with colored output
- 🤖 **Stockfish Integration** - Play against the world's strongest chess engine
- 🎯 **Multiple Game Modes**:
  - New Game - Start a fresh game
  - Continue Game - Enter existing moves and continue playing
  - Gambit Mode - Play with predefined opening gambits
  - Learning Mode - Control both colors with engine suggestions
- ♟️ **41 Chess Openings** - Includes popular gambits, classical openings, and modern defenses
- 📊 **Game Information** - Real-time board display, move history, and evaluation
- 🎨 **Beautiful Board Display** - Unicode chess pieces with colored squares
- ⚡ **Move Validation** - Automatic validation of legal moves

### Web UI Mode (New!)
- 🌐 **Interactive Chess Board** - Drag and drop pieces with visual feedback
- 🤖 **Real-time Engine Integration** - Get Stockfish suggestions instantly
- 🎨 **Modern Interface** - Beautiful, responsive design
- 📱 **Mobile Support** - Works on desktop and mobile devices
- ⚡ **All CLI Features** - Complete feature parity with CLI version
- 🔄 **Real-time Updates** - Live game state and move history
- 📚 **Opening Study** - Visual guided learning for openings

## Prerequisites

- Node.js (v14 or higher)
- Stockfish chess engine installed at: `C:\Program Files\stockfish\stockfish-windows-x86-64-avx2.exe`

## Installation

1. **Install Stockfish** (if not already installed):
   - Download from: https://stockfishchess.org/download/
   - Install to: `C:\Program Files\stockfish\stockfish-windows-x86-64-avx2.exe`
   - Or update the path in `src/stockfish-engine.ts`

2. **Install Dependencies** (using pnpm):
   ```bash
   pnpm install
   ```

3. **Build the Project**:
   ```bash
   pnpm run build
   ```

## Usage

### CLI Mode (Original)
```bash
# Development Mode
pnpm run dev

# Production Mode
pnpm start

# Watch Mode (for development)
pnpm run watch
```

### Web UI Mode (New!)
```bash
# Option 1: One-command startup (Recommended)
pnpm run start:all

# Option 2: Manual startup
# Install dependencies (if not already done)
pnpm install

# Start the backend server (in one terminal)
cd server
pnpm install
pnpm run dev

# Start the web UI (in another terminal)
pnpm run web:dev

# Open http://localhost:3000 in your browser
```

### Quick Start Scripts
```bash
# Windows
start-chesster.bat

# Unix/Linux/Mac
./start-chesster.sh

# Or use npm/pnpm
pnpm run setup
```

### Build Web UI for Production
```bash
pnpm run web:build
```

## Testing

The project includes comprehensive tests for all components:

### Run All Tests
```bash
pnpm test
```

### Run Tests in Watch Mode
```bash
pnpm run test:watch
```

### Run Tests with Coverage
```bash
pnpm run test:coverage
```

### Run Unit Tests Only
```bash
pnpm run test:unit
```

### Run Integration Tests Only
```bash
pnpm run test:integration
```

### Test Structure
- **Unit Tests**: Test individual components in isolation
  - `tests/unit/gambits.test.ts` - Gambit data and utilities
  - `tests/unit/board-display.test.ts` - Board rendering
  - `tests/unit/game-manager.test.ts` - Game logic
- **Integration Tests**: Test component interactions
  - `tests/integration/stockfish-engine.test.ts` - Stockfish engine communication

### Quick Test
To verify basic functionality without running the full test suite:
```bash
node test-game.js
```

## Game Modes

### 1. New Game
- Choose your color (White/Black/Random)
- Play a complete game from the starting position

### 2. Continue Game
- Enter moves that have already been played
- Continue the game from that position
- Useful for analyzing ongoing games

### 3. Gambit Mode
- Choose from 41 popular chess openings and gambits
- Play aggressive opening lines and classical openings
- Available openings include:
  - **Gambits**: King's Gambit, Queen's Gambit, Evans Gambit, Blackmar-Diemer, Latvian, Benko, Budapest, Danish, Göring, From's
  - **Classical Openings**: Ruy Lopez, Italian Game, Sicilian Defense, French Defense, Caro-Kann, English Opening, Nimzo-Indian, Queen's Indian, King's Indian, Dutch Defense
  - **Modern Openings**: Alekhine Defense, Benoni Defense, Bird Opening, Bogo-Indian, Catalan, Grünfeld Defense, King's Indian Attack, London System, Pirc Defense, Réti Opening, Scandinavian Defense, Scotch Game, Slav Defense, Trompowsky Attack
  - **Sicilian Variations**: Sicilian Alapin, Sicilian - Closed
  - **Unusual Openings**: Grob Attack, King's Fianchetto, Nimzowitsch-Larsen Attack, Polish Opening

### 4. Learning Mode 🎓
**Perfect for improving your chess skills!** In learning mode, you control both colors and the engine suggests the best move for each position.

**Features:**
- **Engine Analysis**: Get Stockfish's best move suggestion for every position
- **Position Evaluation**: See if the position is winning, losing, or equal
- **Learning Feedback**: Understand why certain moves are better than others
- **Flexible Play**: Follow engine suggestions or play your own moves
- **📚 Opening Study**: Follow 41+ openings/gambits with guided learning

**How it works:**
1. Choose whether to follow a specific opening or play freely
2. If following an opening, the engine guides you through the best moves
3. Shows expected moves and verifies they're legal
4. Displays position assessment (winning/losing/equal)
5. You choose your move (can follow suggestions or play your own)
6. Continue until game end

**Available Openings for Study:**
- **Gambits (10)**: King's Gambit, Queen's Gambit, Evans Gambit, Blackmar-Diemer, Latvian, Benko, Budapest, Danish, Göring, From's
- **Classical Openings (10)**: Ruy Lopez, Italian Game, Sicilian Defense, French Defense, Caro-Kann, English Opening, Nimzo-Indian, Queen's Indian, King's Indian, Dutch Defense
- **Modern Openings (21)**: Alekhine Defense, Benoni Defense, Bird Opening, Bogo-Indian, Catalan, Grünfeld Defense, King's Indian Attack, London System, Pirc Defense, Réti Opening, Scandinavian Defense, Scotch Game, Sicilian Alapin, Sicilian - Closed, Slav Defense, Trompowsky Attack, Grob Attack, King's Fianchetto, Nimzowitsch-Larsen Attack, Polish Opening

**Perfect for:**
- Learning optimal openings systematically
- Understanding opening theory and principles
- Practicing tactical positions
- Improving positional understanding
- Studying specific opening lines

## Controls

- **Move Input**: Use standard algebraic notation (e.g., `e4`, `Nf3`, `O-O`, `e8=Q`)
- **Exit**: Press `Ctrl+C` to exit the game
- **Navigation**: Use arrow keys and Enter to navigate menus

## Move Notation

The game accepts standard algebraic notation:
- `e4` - Pawn moves
- `Nf3` - Knight moves
- `Bxe5` - Bishop captures
- `O-O` - Kingside castling
- `O-O-O` - Queenside castling
- `e8=Q` - Pawn promotion

## Features

### Board Display
- Unicode chess pieces
- Colored squares (yellow/gray)
- Rotates based on player color
- Shows current position and game state

### Game Information
- Current turn
- Move number
- Check/Checkmate status
- Player and engine colors

### Move History
- Complete move history
- Numbered moves
- Easy to review

### Legal Moves
- Shows all legal moves for current position
- Helps with move selection
- Validates input

### Engine Evaluation
- Real-time position evaluation
- Shows advantage in pawns
- Mate sequences when available

## Troubleshooting

### Stockfish Not Found
If you get a "Stockfish not found" error:
1. Verify Stockfish is installed at the correct path
2. Update the path in `src/stockfish-engine.ts` if needed
3. Make sure the executable has proper permissions

### Permission Issues
If you get permission errors:
1. Run as administrator
2. Check file permissions on Stockfish executable
3. Verify antivirus isn't blocking the process

### Engine Move Issues
If you get "Invalid move" or "Engine timeout" errors:
1. The engine now properly converts UCI moves to algebraic notation
2. Timeout has been reduced to 3 seconds for faster responses
3. Engine depth is limited to 10 for quicker analysis
4. If issues persist, try restarting the game

### Build Errors
If you get TypeScript compilation errors:
1. Make sure all dependencies are installed: `pnpm install`
2. Check TypeScript version: `pnpm exec tsc --version`
3. Clear and rebuild: `pnpm run build`

## Project Structure

```