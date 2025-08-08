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
  
  // Classical Openings
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
  },
  
  // Additional Openings from the list
  {
    name: "Alekhine Defense",
    description: "A hypermodern defense where Black provokes White's pawns forward",
    color: "black",
    moves: ["e4", "Nf6"]
  },
  {
    name: "Benoni Defense",
    description: "A dynamic defense where Black creates an asymmetrical pawn structure",
    color: "black",
    moves: ["d4", "Nf6", "c4", "c5", "d5"]
  },
  {
    name: "Bird Opening",
    description: "An unusual opening where White immediately challenges the center with f4",
    color: "white",
    moves: ["f4"]
  },
  {
    name: "Bogo-Indian Defense",
    description: "A solid defense that avoids the complications of the Nimzo-Indian",
    color: "black",
    moves: ["d4", "Nf6", "c4", "e6", "Nf3", "Bb4+"]
  },
  {
    name: "Catalan Opening",
    description: "A sophisticated opening combining d4 and fianchetto",
    color: "white",
    moves: ["d4", "Nf6", "c4", "e6", "g3"]
  },
  {
    name: "Grob Attack",
    description: "An aggressive opening where White immediately attacks with g4",
    color: "white",
    moves: ["g4"]
  },
  {
    name: "Grünfeld Defense",
    description: "A dynamic defense where Black allows White's center and counterattacks",
    color: "black",
    moves: ["d4", "Nf6", "c4", "g6", "Nc3", "d5"]
  },
  {
    name: "King's Indian Attack",
    description: "A flexible system where White adopts a kingside fianchetto setup",
    color: "white",
    moves: ["Nf3", "d5", "g3"]
  },
  {
    name: "King's Fianchetto",
    description: "A solid opening where White develops with kingside fianchetto",
    color: "white",
    moves: ["g3"]
  },
  {
    name: "London System",
    description: "A solid opening system with early bishop development",
    color: "white",
    moves: ["d4", "Nf6", "Bf4"]
  },
  {
    name: "Nimzowitsch-Larsen Attack",
    description: "An unusual opening where White develops the queen's bishop early",
    color: "white",
    moves: ["b3"]
  },
  {
    name: "Pirc Defense",
    description: "A flexible defense where Black develops pieces before committing pawns",
    color: "black",
    moves: ["e4", "d6", "d4", "Nf6", "Nc3", "g6"]
  },
  {
    name: "Polish Opening",
    description: "An unusual opening where White plays b4 early",
    color: "white",
    moves: ["b4"]
  },
  {
    name: "Réti Opening",
    description: "A hypermodern opening that avoids immediate central pawn moves",
    color: "white",
    moves: ["Nf3", "d5", "c4"]
  },
  {
    name: "Scandinavian Defense",
    description: "A direct defense where Black immediately challenges the e4 pawn",
    color: "black",
    moves: ["e4", "d5"]
  },
  {
    name: "Scotch Game",
    description: "A direct opening where White immediately challenges the center",
    color: "white",
    moves: ["e4", "e5", "Nf3", "Nc6", "d4"]
  },
  {
    name: "Sicilian Alapin",
    description: "A solid approach to the Sicilian avoiding main line theory",
    color: "white",
    moves: ["e4", "c5", "c3"]
  },
  {
    name: "Sicilian - Closed",
    description: "A positional approach to the Sicilian with early d3",
    color: "white",
    moves: ["e4", "c5", "Nc3", "Nc6", "g3"]
  },
  {
    name: "Slav Defense",
    description: "A solid defense that maintains the d5 pawn",
    color: "black",
    moves: ["d4", "d5", "c4", "c6"]
  },
  {
    name: "Spanish Opening",
    description: "Another name for the Ruy Lopez, one of the most analyzed openings",
    color: "white",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"]
  },
  {
    name: "Trompowsky Attack",
    description: "An aggressive opening where White develops the bishop to h6",
    color: "white",
    moves: ["d4", "Nf6", "Bg5"]
  }
];

export function getGambitsByColor(color: 'white' | 'black'): Gambit[] {
  return GAMBITS.filter(gambit => gambit.color === color);
}

export function getGambitByName(name: string): Gambit | undefined {
  return GAMBITS.find(gambit => gambit.name === name);
} 