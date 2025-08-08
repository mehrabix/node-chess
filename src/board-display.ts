import chalk from 'chalk';
import { Chess } from 'chess.js';

export class BoardDisplay {
  static displayBoard(chess: Chess, playerColor: 'white' | 'black' = 'white'): void {
    const board = chess.board();
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = playerColor === 'white' ? ['8', '7', '6', '5', '4', '3', '2', '1'] : ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    console.log('\n' + chalk.bold.cyan('  ' + files.join('   ')));
    console.log(chalk.bold.cyan(' ┌───┬───┬───┬───┬───┬───┬───┬───┐'));
    
    for (let rank = 0; rank < 8; rank++) {
      const rankIndex = playerColor === 'white' ? rank : 7 - rank;
      const rankLabel = ranks[rank];
      
      let row = chalk.bold.cyan(`${rankLabel} │`);
      
      for (let file = 0; file < 8; file++) {
        const fileIndex = playerColor === 'white' ? file : 7 - file;
        const piece = board[rankIndex][fileIndex];
        const isLightSquare = (rankIndex + fileIndex) % 2 === 0;
        
        if (piece) {
          const pieceSymbol = this.getPieceSymbol(piece);
          const pieceColor = piece.color === 'w' ? chalk.white : chalk.black;
          const bgColor = isLightSquare ? chalk.bgYellow : chalk.bgGray;
          row += ` ${bgColor(pieceColor(pieceSymbol))} │`;
        } else {
          const bgColor = isLightSquare ? chalk.bgYellow : chalk.bgGray;
          row += ` ${bgColor(' ')} │`;
        }
      }
      
      console.log(row);
      
      if (rank < 7) {
        console.log(chalk.bold.cyan(' ├───┼───┼───┼───┼───┼───┼───┼───┤'));
      }
    }
    
    console.log(chalk.bold.cyan(' └───┴───┴───┴───┴───┴───┴───┴───┘'));
    console.log(chalk.bold.cyan('  ' + files.join('   ')) + '\n');
  }

  private static getPieceSymbol(piece: any): string {
    const symbols: { [key: string]: string } = {
      'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
      'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
    };
    return symbols[piece.color + piece.type] || '?';
  }

  static displayGameInfo(chess: Chess, playerColor: 'white' | 'black', engineColor: 'white' | 'black'): void {
    console.log(chalk.bold.green('=== Game Information ==='));
    console.log(chalk.white(`Player Color: ${chalk.bold(playerColor.toUpperCase())}`));
    console.log(chalk.white(`Engine Color: ${chalk.bold(engineColor.toUpperCase())}`));
    console.log(chalk.white(`Current Turn: ${chalk.bold(chess.turn() === 'w' ? 'WHITE' : 'BLACK')}`));
    console.log(chalk.white(`Move Number: ${chalk.bold(Math.floor(chess.history().length / 2) + 1)}`));
    
    if (chess.isCheck()) {
      console.log(chalk.bold.red('CHECK!'));
    }
    
    if (chess.isCheckmate()) {
      console.log(chalk.bold.red('CHECKMATE!'));
    } else if (chess.isDraw()) {
      console.log(chalk.bold.yellow('DRAW!'));
    } else if (chess.isStalemate()) {
      console.log(chalk.bold.yellow('STALEMATE!'));
    }
    
    console.log(chalk.bold.green('======================\n'));
  }

  static displayMoveHistory(moves: string[]): void {
    if (moves.length === 0) {
      console.log(chalk.yellow('No moves played yet.'));
      return;
    }

    console.log(chalk.bold.blue('=== Move History ==='));
    for (let i = 0; i < moves.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = moves[i];
      const blackMove = moves[i + 1];
      
      if (blackMove) {
        console.log(chalk.white(`${moveNumber}. ${whiteMove} ${blackMove}`));
      } else {
        console.log(chalk.white(`${moveNumber}. ${whiteMove}`));
      }
    }
    console.log(chalk.bold.blue('===================\n'));
  }

  static displayLegalMoves(chess: Chess): void {
    const legalMoves = chess.moves();
    if (legalMoves.length === 0) {
      console.log(chalk.red('No legal moves available.'));
      return;
    }

    console.log(chalk.bold.magenta('=== Legal Moves ==='));
    const movesPerLine = 8;
    for (let i = 0; i < legalMoves.length; i += movesPerLine) {
      const lineMoves = legalMoves.slice(i, i + movesPerLine);
      console.log(chalk.white(lineMoves.join(' ')));
    }
    console.log(chalk.bold.magenta('==================\n'));
  }

  static displayEvaluation(score: number): void {
    let evaluation = '';
    if (Math.abs(score) > 9000) {
      evaluation = score > 0 ? 'Mate for White' : 'Mate for Black';
    } else {
      const pawns = (score / 100).toFixed(1);
      evaluation = score > 0 ? `+${pawns} (White ahead)` : `${pawns} (Black ahead)`;
    }
    
    console.log(chalk.bold.cyan(`Evaluation: ${evaluation}`));
  }
} 