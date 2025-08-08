import { GameManager } from './game-manager';
import chalk from 'chalk';

async function main() {
  const gameManager = new GameManager();
  
  try {
    await gameManager.initialize();
    await gameManager.startGame();
  } catch (error) {
    console.error(chalk.bold.red('Fatal error:'), error);
    console.log(chalk.yellow('\nPlease make sure Stockfish is installed at:'));
    console.log(chalk.white('C:\\Program Files\\stockfish\\stockfish-windows-x86-64-avx2.exe'));
    console.log(chalk.yellow('\nOr update the path in stockfish-engine.ts'));
  } finally {
    await gameManager.cleanup();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\nGoodbye! Thanks for playing Chesster!'));
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log(chalk.yellow('\n\nGoodbye! Thanks for playing Chesster!'));
  process.exit(0);
});

// Start the game
main().catch(console.error); 