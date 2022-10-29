import { SlidingTiles } from "../search/problems";

// TODO Set up with typescript
describe('SlidingTiles', () => {
  const eightPuzzle = new SlidingTiles({
    initialState: [1, 2, 3, 4, 5, 7, 8, 6, 0],
    goalState: [1, 2, 3, 4, 5, 6, 7, 8, 0]
  });

  test('sliding tiles actions', () => {
    expect(eightPuzzle.getActions([0, 1, 2, 3, 4, 5, 6, 7, 8])).toEqual(new Set(['R', 'D']));
    expect(eightPuzzle.getActions([1, 0, 2, 3, 4, 5, 6, 7, 8])).toEqual(new Set(['L', 'R', 'D']));
    expect(eightPuzzle.getActions([1, 2, 0, 3, 4, 5, 6, 7, 8])).toEqual(new Set(['L', 'D']));
    expect(eightPuzzle.getActions([1, 2, 3, 0, 4, 5, 6, 7, 8])).toEqual(new Set(['U', 'R', 'D']));
    expect(eightPuzzle.getActions([1, 2, 3, 4, 0, 5, 6, 7, 8])).toEqual(new Set(['U', 'L', 'R', 'D']));
    expect(eightPuzzle.getActions([1, 2, 3, 4, 5, 0, 6, 7, 8])).toEqual(new Set(['U', 'L', 'D']));
    expect(eightPuzzle.getActions([1, 2, 3, 4, 5, 6, 0, 7, 8])).toEqual(new Set(['U', 'R']));
    expect(eightPuzzle.getActions([1, 2, 3, 4, 5, 6, 7, 0, 8])).toEqual(new Set(['U', 'L', 'R']));
    expect(eightPuzzle.getActions([1, 2, 3, 4, 5, 6, 7, 8, 0])).toEqual(new Set(['U', 'L']));
  })

  test('sliding tiles action results', () => {
    expect(eightPuzzle.getActionResult([0, 1, 2, 3, 4, 5, 6, 7, 8], 'R')).toEqual([1, 0, 2, 3, 4, 5, 6, 7, 8]);
    expect(eightPuzzle.getActionResult([0, 1, 2, 3, 4, 5, 6, 7, 8], 'D')).toEqual([3, 1, 2, 0, 4, 5, 6, 7, 8]);
    expect(eightPuzzle.getActionResult([1, 0, 2, 3, 4, 5, 6, 7, 8], 'L')).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(eightPuzzle.getActionResult([1, 2, 3, 4, 0, 5, 6, 7, 8], 'U')).toEqual([1, 0, 3, 4, 2, 5, 6, 7, 8]);
  })

  test('sliding tiles goal', () => {
    expect(eightPuzzle.isGoal([1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(true);
    expect(eightPuzzle.isGoal([0, 1, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
  })
})