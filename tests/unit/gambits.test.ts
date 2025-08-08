import { GAMBITS, getGambitsByColor, getGambitByName } from '../../src/gambits';
import { Gambit } from '../../src/types';

describe('Gambits Module', () => {
  describe('GAMBITS constant', () => {
    it('should contain exactly 41 openings', () => {
      expect(GAMBITS).toHaveLength(41);
    });

    it('should have valid opening structure', () => {
      GAMBITS.forEach((gambit: Gambit) => {
        expect(gambit).toHaveProperty('name');
        expect(gambit).toHaveProperty('description');
        expect(gambit).toHaveProperty('moves');
        expect(gambit).toHaveProperty('color');
        
        expect(typeof gambit.name).toBe('string');
        expect(typeof gambit.description).toBe('string');
        expect(Array.isArray(gambit.moves)).toBe(true);
        expect(['white', 'black']).toContain(gambit.color);
        
        expect(gambit.name.length).toBeGreaterThan(0);
        expect(gambit.description.length).toBeGreaterThan(0);
        expect(gambit.moves.length).toBeGreaterThan(0);
      });
    });

    it('should have unique names', () => {
      const names = GAMBITS.map(g => g.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('should have valid chess moves', () => {
      GAMBITS.forEach((gambit: Gambit) => {
        gambit.moves.forEach(move => {
          expect(typeof move).toBe('string');
          expect(move.length).toBeGreaterThan(0);
          // Basic chess move validation
          expect(move).toMatch(/^[a-h][1-8]|[NBRQK][a-h]?[1-8]?x?[a-h][1-8]|O-O(-O)?|[a-h]x[a-h][1-8]|[a-h][1-8]=[NBRQ]$/);
        });
      });
    });
  });

  describe('getGambitsByColor', () => {
    it('should return white openings when color is white', () => {
      const whiteOpenings = getGambitsByColor('white');
      expect(whiteOpenings.length).toBeGreaterThan(0);
      whiteOpenings.forEach(gambit => {
        expect(gambit.color).toBe('white');
      });
    });

    it('should return black openings when color is black', () => {
      const blackOpenings = getGambitsByColor('black');
      expect(blackOpenings.length).toBeGreaterThan(0);
      blackOpenings.forEach(gambit => {
        expect(gambit.color).toBe('black');
      });
    });

    it('should return all openings when combined', () => {
      const whiteOpenings = getGambitsByColor('white');
      const blackOpenings = getGambitsByColor('black');
      expect(whiteOpenings.length + blackOpenings.length).toBe(GAMBITS.length);
    });
  });

  describe('getGambitByName', () => {
    it('should return correct opening for valid name', () => {
      const kingsGambit = getGambitByName("King's Gambit");
      expect(kingsGambit).toBeDefined();
      expect(kingsGambit?.name).toBe("King's Gambit");
      expect(kingsGambit?.color).toBe('white');
    });

    it('should return undefined for invalid name', () => {
      const invalidGambit = getGambitByName('Invalid Opening');
      expect(invalidGambit).toBeUndefined();
    });

    it('should be case sensitive', () => {
      const kingsGambit = getGambitByName("king's gambit");
      expect(kingsGambit).toBeUndefined();
    });

    it('should work for all opening names', () => {
      GAMBITS.forEach(gambit => {
        const found = getGambitByName(gambit.name);
        expect(found).toBeDefined();
        expect(found?.name).toBe(gambit.name);
      });
    });
  });

  describe('Specific Opening Tests', () => {
    it('should have King\'s Gambit with correct moves', () => {
      const kingsGambit = getGambitByName("King's Gambit");
      expect(kingsGambit?.moves).toEqual(['e4', 'e5', 'f4']);
    });

    it('should have Queen\'s Gambit with correct moves', () => {
      const queensGambit = getGambitByName("Queen's Gambit");
      expect(queensGambit?.moves).toEqual(['d4', 'd5', 'c4']);
    });

    it('should have Evans Gambit with correct moves', () => {
      const evansGambit = getGambitByName("Evans Gambit");
      expect(evansGambit?.moves).toEqual(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4']);
    });

    it('should have King\'s Indian Defense with correct moves', () => {
      const kid = getGambitByName("King's Indian Defense");
      expect(kid?.moves).toEqual(['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7']);
    });

    it('should have Alekhine Defense with correct moves', () => {
      const alekhine = getGambitByName("Alekhine Defense");
      expect(alekhine?.moves).toEqual(['e4', 'Nf6']);
    });

    it('should have Sicilian Defense with correct moves', () => {
      const sicilian = getGambitByName("Sicilian Defense");
      expect(sicilian?.moves).toEqual(['e4', 'c5']);
    });

    it('should have Ruy Lopez with correct moves', () => {
      const ruyLopez = getGambitByName("Ruy Lopez (Spanish Opening)");
      expect(ruyLopez?.moves).toEqual(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5']);
    });

    it('should have Trompowsky Attack with correct moves', () => {
      const trompowsky = getGambitByName("Trompowsky Attack");
      expect(trompowsky?.moves).toEqual(['d4', 'Nf6', 'Bg5']);
    });
  });
}); 