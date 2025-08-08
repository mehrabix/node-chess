import { Chess } from 'chess.js';

export interface Gambit {
  name: string;
  description: string;
  moves: string[];
  color: 'white' | 'black';
}

export interface GameState {
  chess: Chess;
  playerColor: 'white' | 'black';
  engineColor: 'white' | 'black';
  selectedGambit?: Gambit;
  moveHistory: string[];
}

export interface StockfishMove {
  move: string;
  score: number;
  depth: number;
  time: number;
}

export interface MenuOption {
  name: string;
  value: string;
  description?: string;
}

export type GameMode = 'new' | 'continue' | 'gambit';
export type ColorChoice = 'white' | 'black' | 'random'; 