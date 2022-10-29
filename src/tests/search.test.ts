import { SlidingTiles, aStarSearch, greedySearch } from "../search";

describe('sliding tiles', () =>  {
  const eightPuzzle = new SlidingTiles({
    initialState: [1, 2, 3, 4, 5, 7, 8, 6, 0],
    goalState: [1, 2, 3, 4, 5, 6, 7, 8, 0]
  });

  // Unit tests for implementation of the SlidingTiles problem/mechanics
  describe('problem implementation', () => {
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
      expect(SlidingTiles.isSolvable([0, 1, 2, 3, 4, 5, 6, 7, 8])).toBe(true);
      expect(SlidingTiles.isSolvable([1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(true);
      expect(SlidingTiles.isSolvable([1, 2, 3, 4, 0, 6, 7, 5, 8])).toBe(true);
      expect(SlidingTiles.isSolvable([1, 2, 3, 4, 5, 6, 8, 7])).toBe(false);
      expect(SlidingTiles.isSolvable([8, 1, 2, 0, 4, 3, 7, 6, 5])).toBe(false);
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

  // Unit tests for the search algorithms run on the SlidingTiles problem
  describe('search', () => {
    const eightPuzzle1 = new SlidingTiles({initialState: [1, 2, 3, 4, 5, 6, 0, 7, 8], goalState: [1, 2, 3, 4, 5, 6, 7, 8, 0]});
    const eightPuzzle2 = new SlidingTiles({initialState: [4, 1, 3, 2, 6, 8, 7, 5, 0], goalState: [1, 2, 3, 4, 5, 6, 7, 8, 0]});
    const eightPuzzle3 = new SlidingTiles({initialState: [7, 1, 6, 3, 0, 4, 5, 8, 2], goalState: [1, 2, 3, 4, 5, 6, 7, 8, 0]});
    const eightPuzzle4 = new SlidingTiles({initialState: [3, 1, 6, 5, 8, 7, 0, 2, 4], goalState: [1, 2, 3, 4, 5, 6, 7, 8, 0]});
    const eightPuzzle5 = new SlidingTiles({initialState: [4, 2, 1, 6, 0, 5, 3, 8, 7], goalState: [1, 2, 3, 4, 5, 6, 7, 8, 0]});

    // A* uses best first search best first search algorithm implicitly
    describe('A*', () => {
      test('puzzle 1', () => {
        expect(aStarSearch(eightPuzzle1, eightPuzzle1.misplacedTilesHeuristic.bind(eightPuzzle1))?.pathCost).toBe(2);
        expect(aStarSearch(eightPuzzle1, eightPuzzle1.manhattanDistanceHeuristic.bind(eightPuzzle1))?.pathCost).toBe(2);
      })
      test('puzzle 2', () => {
        expect(aStarSearch(eightPuzzle2, eightPuzzle2.misplacedTilesHeuristic.bind(eightPuzzle2))?.pathCost).toBe(8);
        expect(aStarSearch(eightPuzzle2, eightPuzzle2.manhattanDistanceHeuristic.bind(eightPuzzle2))?.pathCost).toBe(8);
      })
      test('puzzle 3', () => {
        expect(aStarSearch(eightPuzzle3, eightPuzzle3.misplacedTilesHeuristic.bind(eightPuzzle3))?.pathCost).toBe(16);
        expect(aStarSearch(eightPuzzle3, eightPuzzle3.manhattanDistanceHeuristic.bind(eightPuzzle3))?.pathCost).toBe(16);
      })
      // Use Manhattan distance only for these harder puzzles to get faster results
      test('puzzle 4', () => {
        expect(aStarSearch(eightPuzzle4, eightPuzzle4.manhattanDistanceHeuristic.bind(eightPuzzle4))?.pathCost).toBe(22);
      })
      test('puzzle 5', () => {
        expect(aStarSearch(eightPuzzle5, eightPuzzle5.manhattanDistanceHeuristic.bind(eightPuzzle5))?.pathCost).toBe(24);
      })
    })

    describe('greedy search', () => {
      test('puzzle 1', () => {
        expect(greedySearch(eightPuzzle1, eightPuzzle1.manhattanDistanceHeuristic.bind(eightPuzzle1))?.state).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0]);
      })
      test('puzzle 2', () => {
        expect(greedySearch(eightPuzzle2, eightPuzzle2.manhattanDistanceHeuristic.bind(eightPuzzle2))?.state).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0]);
      })
    })
  })
})

