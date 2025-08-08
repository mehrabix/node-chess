import { GAMBITS, getGambitsByColor, getGambitByName } from '../../src/gambits';
import { Gambit } from '../../src/types';

describe('Gambits Module', () => {
  describe('GAMBITS constant', () => {
    it('should contain exactly 10 gambits', () => {
      expect(GAMBITS).toHaveLength(10);
    });

    it('should have valid gambit structure', () => {
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
    it('should return white gambits when color is white', () => {
      const whiteGambits = getGambitsByColor('white');
      expect(whiteGambits.length).toBeGreaterThan(0);
      whiteGambits.forEach(gambit => {
        expect(gambit.color).toBe('white');
      });
    });

    it('should return black gambits when color is black', () => {
      const blackGambits = getGambitsByColor('black');
      expect(blackGambits.length).toBeGreaterThan(0);
      blackGambits.forEach(gambit => {
        expect(gambit.color).toBe('black');
      });
    });

    it('should return all gambits when combined', () => {
      const whiteGambits = getGambitsByColor('white');
      const blackGambits = getGambitsByColor('black');
      expect(whiteGambits.length + blackGambits.length).toBe(GAMBITS.length);
    });
  });

  describe('getGambitByName', () => {
    it('should return correct gambit for valid name', () => {
      const kingsGambit = getGambitByName("King's Gambit");
      expect(kingsGambit).toBeDefined();
      expect(kingsGambit?.name).toBe("King's Gambit");
      expect(kingsGambit?.color).toBe('white');
    });

    it('should return undefined for invalid name', () => {
      const invalidGambit = getGambitByName('Invalid Gambit');
      expect(invalidGambit).toBeUndefined();
    });

    it('should be case sensitive', () => {
      const kingsGambit = getGambitByName("king's gambit");
      expect(kingsGambit).toBeUndefined();
    });

    it('should work for all gambit names', () => {
      GAMBITS.forEach(gambit => {
        const found = getGambitByName(gambit.name);
        expect(found).toBeDefined();
        expect(found?.name).toBe(gambit.name);
      });
    });
  });

  describe('Specific Gambit Tests', () => {
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
  });
}); 