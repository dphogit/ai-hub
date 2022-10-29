import { SlidingTiles } from "../search/problems";

describe('SlidingTiles', () =>  {
  const eightPuzzle = new SlidingTiles({
    initialState: [1, 2, 3, 4, 5, 7, 8, 6, 0],
    goalState: [1, 2, 3, 4, 5, 6, 7, 8, 0]
  });

  test('actions', () => {
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

  test('action results', () => {
    expect(eightPuzzle.getActionResult([0, 1, 2, 3, 4, 5, 6, 7, 8], 'R')).toEqual([1, 0, 2, 3, 4, 5, 6, 7, 8]);
    expect(eightPuzzle.getActionResult([0, 1, 2, 3, 4, 5, 6, 7, 8], 'D')).toEqual([3, 1, 2, 0, 4, 5, 6, 7, 8]);
    expect(eightPuzzle.getActionResult([1, 0, 2, 3, 4, 5, 6, 7, 8], 'L')).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(eightPuzzle.getActionResult([1, 2, 3, 4, 0, 5, 6, 7, 8], 'U')).toEqual([1, 0, 3, 4, 2, 5, 6, 7, 8]);
  })

  test('goal', () => {
    expect(eightPuzzle.isGoal([1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(true);
    expect(eightPuzzle.isGoal([0, 1, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
  })

  test('solvable', () => {
    expect(eightPuzzle.isSolvable([0, 1, 2, 3, 4, 5, 6, 7, 8])).toBe(true);
    expect(eightPuzzle.isSolvable([1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(true);
    expect(eightPuzzle.isSolvable([1, 2, 3, 4, 0, 6, 7, 5, 8])).toBe(true);
    expect(eightPuzzle.isSolvable([1, 2, 3, 4, 5, 6, 8, 7])).toBe(false);
    expect(eightPuzzle.isSolvable([8, 1, 2, 0, 4, 3, 7, 6, 5])).toBe(false);
  })

  test('misplaced tiles heuristic', () => {
    expect(eightPuzzle.misplacedTilesHeuristic([1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(0);
    expect(eightPuzzle.misplacedTilesHeuristic([1, 2, 3, 4, 5, 6, 7, 0, 8])).toBe(1);
    expect(eightPuzzle.misplacedTilesHeuristic([1, 2, 3, 4, 5, 6, 0, 7, 8])).toBe(2);
    expect(eightPuzzle.misplacedTilesHeuristic([3, 1, 2, 6, 4, 5, 0, 7, 8])).toBe(8);
    expect(eightPuzzle.misplacedTilesHeuristic([0, 1, 2, 3, 4, 5, 6, 7, 8])).toBe(8);
  })

  test('manhattan distance heuristic', () => {
    expect(eightPuzzle.manhattanDistanceHeuristic([1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(0);
    expect(eightPuzzle.manhattanDistanceHeuristic([1, 2, 3, 4, 5, 6, 7, 0, 8])).toBe(1);
    expect(eightPuzzle.manhattanDistanceHeuristic([0, 1, 2, 3, 4, 5, 6, 7, 8])).toBe(12);
    expect(eightPuzzle.manhattanDistanceHeuristic([7, 2, 4, 5, 0, 6, 8, 3, 1])).toBe(14);
  })

  test('action cost', () => {
    expect(eightPuzzle.getActionCost([1, 2, 3, 4, 5, 6, 7, 0, 8], 'R', [1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(1);
  })
})