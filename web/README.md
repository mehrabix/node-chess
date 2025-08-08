# Chesster Web UI

A modern, interactive web interface for the Chesster chess game with Stockfish engine integration.

## Features

- **Interactive Chess Board**: Drag and drop pieces with visual feedback
- **Real-time Engine Integration**: Get Stockfish suggestions instantly
- **Multiple Game Modes**: New game, learning mode, gambit play
- **Opening Study**: Follow top 20 openings with guided learning
- **Move History**: Track all moves with algebraic notation
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js 16+ and pnpm
- Stockfish engine installed (see main README)
- Backend server running (see server/README.md)

## Installation

1. **Install Dependencies**:
   ```bash
   cd web
   pnpm install
   ```

2. **Start Development Server**:
   ```bash
   pnpm run web:dev
   ```

3. **Build for Production**:
   ```bash
   pnpm run web:build
   ```

## Usage

1. **Start the Backend Server** (in another terminal):
   ```bash
   cd server
   pnpm install
   pnpm run dev
   ```

2. **Open the Web UI**:
   Navigate to `http://localhost:3000`

3. **Select Game Mode**:
   - **New Game**: Play against Stockfish engine
   - **Learning Mode**: Control both colors with engine suggestions
   - **Play Gambit**: Choose from top openings/gambits

## Game Modes

### New Game
- Choose your color (White/Black)
- Play against Stockfish engine
- Get real-time move suggestions

### Learning Mode
- Control both colors
- Get engine analysis for each position
- Learn optimal play patterns
- Follow specific openings

### Gambit Mode
- Select from 20 popular openings
- Automatic opening moves
- Continue with engine play

## Controls

- **Drag & Drop**: Move pieces by dragging them
- **Click**: Select pieces and click target squares
- **Engine Suggestion**: Click "Get Engine Suggestion" in learning mode
- **Undo Move**: Click "Undo Move" to take back last move
- **New Game**: Click "New Game" to start over

## Technical Details

- **Frontend**: React 18 + TypeScript + Vite
- **Chess Engine**: chess.js for game logic
- **UI Components**: react-chessboard for board display
- **Backend Communication**: REST API + Socket.IO
- **Styling**: CSS with modern design system

## Development

### Project Structure
```
web/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   ├── index.css        # Global styles
│   └── App.css          # Component styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

### Available Scripts
- `pnpm run web:dev` - Start development server
- `pnpm run web:build` - Build for production
- `pnpm run web:preview` - Preview production build

### Customization
- Modify `src/App.tsx` for game logic changes
- Update `src/index.css` for styling changes
- Add new components in `src/` directory

## Troubleshooting

### Engine Not Responding
- Ensure backend server is running on port 5000
- Check Stockfish installation path
- Verify engine initialization in server logs

### Board Not Loading
- Check browser console for errors
- Ensure all dependencies are installed
- Verify Vite development server is running

### Move Validation Issues
- Check chess.js integration
- Verify move notation format
- Ensure proper game state management 