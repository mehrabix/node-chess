import { Gambit } from './types';

export const GAMBITS: Gambit[] = [
  // Top 10 Gambits (existing)
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
  },
  
  // Top 10 Classical Openings
  {
    name: "Ruy Lopez (Spanish Opening)",
    description: "One of the oldest and most respected openings, focusing on central control and piece development",
    color: "white",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"]
  },
  {
    name: "Italian Game",
    description: "A classic opening emphasizing rapid development and central control",
    color: "white",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"]
  },
  {
    name: "Sicilian Defense",
    description: "Black's most popular response to 1.e4, creating asymmetrical positions",
    color: "black",
    moves: ["e4", "c5"]
  },
  {
    name: "French Defense",
    description: "A solid defense where Black aims for a closed position with pawn structure advantages",
    color: "black",
    moves: ["e4", "e6"]
  },
  {
    name: "Caro-Kann Defense",
    description: "A solid defense that avoids the complications of the French Defense",
    color: "black",
    moves: ["e4", "c6"]
  },
  {
    name: "English Opening",
    description: "A flexible opening that can transpose into many other openings",
    color: "white",
    moves: ["c4"]
  },
  {
    name: "Nimzo-Indian Defense",
    description: "A hypermodern defense that focuses on piece activity over pawn structure",
    color: "black",
    moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"]
  },
  {
    name: "Queen's Indian Defense",
    description: "A solid defense that aims for a balanced middlegame",
    color: "black",
    moves: ["d4", "Nf6", "c4", "e6", "Nf3", "b6"]
  },
  {
    name: "King's Indian Defense",
    description: "An aggressive defense where Black aims for a kingside attack",
    color: "black",
    moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7"]
  },
  {
    name: "Dutch Defense",
    description: "An aggressive defense where Black immediately challenges the center",
    color: "black",
    moves: ["d4", "f5"]
  }
];

export function getGambitsByColor(color: 'white' | 'black'): Gambit[] {
  return GAMBITS.filter(gambit => gambit.color === color);
}

export function getGambitByName(name: string): Gambit | undefined {
  return GAMBITS.find(gambit => gambit.name === name);
} 