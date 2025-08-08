import { Gambit } from './types';

export const GAMBITS: Gambit[] = [
  {
    name: "King's Gambit",
    description: "A classic attacking opening where White sacrifices a pawn for rapid development and attacking chances",
    color: "white",
    moves: ["e4", "e5", "f4"]
  },
  {
    name: "Queen's Gambit",
    description: "A positional opening where White offers a pawn to gain central control",
    color: "white",
    moves: ["d4", "d5", "c4"]
  },
  {
    name: "Evans Gambit",
    description: "An aggressive gambit in the Italian Game, sacrificing a pawn for rapid development",
    color: "white",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "b4"]
  },
  {
    name: "Blackmar-Diemer Gambit",
    description: "A sharp attacking gambit where White sacrifices a pawn for quick development",
    color: "white",
    moves: ["d4", "d5", "e4"]
  },
  {
    name: "Latvian Gambit",
    description: "A risky gambit where Black sacrifices a pawn for attacking chances",
    color: "black",
    moves: ["e4", "e5", "Nf3", "f5"]
  },
  {
    name: "Benko Gambit",
    description: "Black sacrifices a pawn for long-term pressure on the queenside",
    color: "black",
    moves: ["d4", "Nf6", "c4", "c5", "d5", "b5"]
  },
  {
    name: "Budapest Gambit",
    description: "Black sacrifices a pawn for active piece play and attacking chances",
    color: "black",
    moves: ["d4", "Nf6", "c4", "e5"]
  },
  {
    name: "Danish Gambit",
    description: "White sacrifices two pawns for rapid development and attacking chances",
    color: "white",
    moves: ["e4", "e5", "d4", "exd4", "c3"]
  },
  {
    name: "Göring Gambit",
    description: "A sharp gambit in the Scotch Game, sacrificing a pawn for attacking play",
    color: "white",
    moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "c3"]
  },
  {
    name: "From's Gambit",
    description: "A rare gambit where Black sacrifices a pawn for quick development",
    color: "black",
    moves: ["f4", "e5"]
  }
];

export function getGambitsByColor(color: 'white' | 'black'): Gambit[] {
  return GAMBITS.filter(gambit => gambit.color === color);
}

export function getGambitByName(name: string): Gambit | undefined {
  return GAMBITS.find(gambit => gambit.name === name);
} 