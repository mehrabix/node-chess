import { Chess } from 'chess.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { GameState, GameMode, ColorChoice, StockfishMove } from './types';
import { StockfishEngine } from './stockfish-engine';
import { BoardDisplay } from './board-display';
import { GAMBITS, getGambitsByColor } from './gambits';

export class GameManager {
  private gameState: GameState;
  private engine: StockfishEngine;

  constructor() {
    this.engine = new StockfishEngine();
    this.gameState = {
      chess: new Chess(),
      playerColor: 'white',
      engineColor: 'black',
      moveHistory: []
    };
  }

  async initialize(): Promise<void> {
    try {
      console.log(chalk.bold.blue('Initializing Stockfish engine...'));
      await this.engine.initialize();
      console.log(chalk.bold.green('Stockfish engine ready!'));
    } catch (error) {
      console.error(chalk.bold.red('Failed to initialize Stockfish engine:'), error);
      throw error;
    }
  }

  async startGame(): Promise<void> {
    console.clear();
    console.log(chalk.bold.cyan('♔ Chesster - Interactive Chess Game ♔'));
    console.log(chalk.yellow('Playing against Stockfish engine\n'));

    const gameMode = await this.selectGameMode();
    
    switch (gameMode) {
      case 'new':
        await this.newGame();
        break;
      case 'continue':
        await this.continueGame();
        break;
      case 'gambit':
        await this.gambitGame();
        break;
    }
  }

  private async selectGameMode(): Promise<GameMode> {
    const { mode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'Select game mode:',
        choices: [
          { name: 'New Game', value: 'new' },
          { name: 'Continue Game (Enter moves)', value: 'continue' },
          { name: 'Play Gambit', value: 'gambit' }
        ]
      }
    ]);
    return mode;
  }

  private async newGame(): Promise<void> {
    const colorChoice = await this.selectColor();
    this.gameState.playerColor = colorChoice;
    this.gameState.engineColor = colorChoice === 'white' ? 'black' : 'white';
    
    await this.playGame();
  }

  private async selectColor(): Promise<'white' | 'black'> {
    const { color } = await inquirer.prompt([
      {
        type: 'list',
        name: 'color',
        message: 'Choose your color:',
        choices: [
          { name: 'White (Play first)', value: 'white' },
          { name: 'Black (Play second)', value: 'black' },
          { name: 'Random', value: 'random' }
        ]
      }
    ]);

    if (color === 'random') {
      return Math.random() < 0.5 ? 'white' : 'black';
    }
    return color;
  }

  private async continueGame(): Promise<void> {
    const { moves } = await inquirer.prompt([
      {
        type: 'input',
        name: 'moves',
        message: 'Enter the moves played so far (e.g., "e4 e5 Nf3 Nc6"):',
        default: ''
      }
    ]);

    const { color } = await inquirer.prompt([
      {
        type: 'list',
        name: 'color',
        message: 'What color are you playing?',
        choices: [
          { name: 'White', value: 'white' },
          { name: 'Black', value: 'black' }
        ]
      }
    ]);

    this.gameState.playerColor = color;
    this.gameState.engineColor = color === 'white' ? 'black' : 'white';

    if (moves.trim()) {
      const moveList = moves.trim().split(/\s+/);
      for (const move of moveList) {
        try {
          this.gameState.chess.move(move);
          this.gameState.moveHistory.push(move);
        } catch (error) {
          console.log(chalk.red(`Invalid move: ${move}`));
          return;
        }
      }
    }

    await this.playGame();
  }

  private async gambitGame(): Promise<void> {
    const { color } = await inquirer.prompt([
      {
        type: 'list',
        name: 'color',
        message: 'Choose your color:',
        choices: [
          { name: 'White', value: 'white' },
          { name: 'Black', value: 'black' }
        ]
      }
    ]);

    this.gameState.playerColor = color;
    this.gameState.engineColor = color === 'white' ? 'black' : 'white';

    const availableGambits = getGambitsByColor(color);
    const { gambitName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'gambitName',
        message: 'Select a gambit to play:',
        choices: availableGambits.map(g => ({
          name: `${g.name} - ${g.description}`,
          value: g.name
        }))
      }
    ]);

    const selectedGambit = availableGambits.find(g => g.name === gambitName);
    if (selectedGambit) {
      this.gameState.selectedGambit = selectedGambit;
      console.log(chalk.bold.green(`Playing ${selectedGambit.name}!`));
    }

    await this.playGame();
  }

  private async playGame(): Promise<void> {
    console.clear();
    
    while (!this.gameState.chess.isGameOver()) {
      BoardDisplay.displayBoard(this.gameState.chess, this.gameState.playerColor);
      BoardDisplay.displayGameInfo(this.gameState.chess, this.gameState.playerColor, this.gameState.engineColor);
      BoardDisplay.displayMoveHistory(this.gameState.moveHistory);

      const currentTurn = this.gameState.chess.turn() === 'w' ? 'white' : 'black';
      
      if (currentTurn === this.gameState.playerColor) {
        await this.playerMove();
      } else {
        await this.engineMove();
      }
    }

    this.displayGameResult();
  }

  private async playerMove(): Promise<void> {
    const legalMoves = this.gameState.chess.moves();
    BoardDisplay.displayLegalMoves(this.gameState.chess);

    const { move } = await inquirer.prompt([
      {
        type: 'input',
        name: 'move',
        message: `Your move (${this.gameState.playerColor}):`,
        validate: (input: string) => {
          if (!input.trim()) return 'Move cannot be empty';
          if (!legalMoves.includes(input.trim())) {
            return `Invalid move. Legal moves: ${legalMoves.join(', ')}`;
          }
          return true;
        }
      }
    ]);

    try {
      this.gameState.chess.move(move.trim());
      this.gameState.moveHistory.push(move.trim());
      console.log(chalk.green(`You played: ${move.trim()}`));
    } catch (error) {
      console.log(chalk.red('Invalid move!'));
    }
  }

  private async engineMove(): Promise<void> {
    console.log(chalk.yellow('Engine is thinking...'));
    
    try {
      await this.engine.setMoves(this.gameState.moveHistory);
      const stockfishMove = await this.engine.getBestMove(15, 3000);
      
      this.gameState.chess.move(stockfishMove.move);
      this.gameState.moveHistory.push(stockfishMove.move);
      
      console.log(chalk.blue(`Engine played: ${stockfishMove.move}`));
      BoardDisplay.displayEvaluation(stockfishMove.score);
    } catch (error) {
      console.log(chalk.red('Engine error:', error));
    }
  }

  private displayGameResult(): void {
    console.clear();
    BoardDisplay.displayBoard(this.gameState.chess, this.gameState.playerColor);
    BoardDisplay.displayGameInfo(this.gameState.chess, this.gameState.playerColor, this.gameState.engineColor);
    BoardDisplay.displayMoveHistory(this.gameState.moveHistory);

    if (this.gameState.chess.isCheckmate()) {
      const winner = this.gameState.chess.turn() === 'w' ? 'Black' : 'White';
      console.log(chalk.bold.red(`Checkmate! ${winner} wins!`));
    } else if (this.gameState.chess.isDraw()) {
      console.log(chalk.bold.yellow('Game is a draw!'));
    } else if (this.gameState.chess.isStalemate()) {
      console.log(chalk.bold.yellow('Stalemate!'));
    }
  }

  async cleanup(): Promise<void> {
    await this.engine.quit();
  }
} 