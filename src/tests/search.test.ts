import { List } from "immutable";
import {
  SlidingTiles,
  AStarSearch,
  GreedySearch,
  UniformCostSearch,
  BreadthFirstSearch,
  DepthFirstSearch,
} from "../search";

// Unit tests for all problems and their implementations
describe('problems', () =>  {

  // Unit tests for implementation of the SlidingTiles problem
  describe('sliding tiles', () => {
    const eightPuzzle = new SlidingTiles({
      initialState: List([1, 2, 3, 4, 5, 7, 8, 6, 0]),
      goalState: List([1, 2, 3, 4, 5, 6, 7, 8, 0])
    });

    test('actions', () => {
      expect(eightPuzzle.getActions(List([0, 1, 2, 3, 4, 5, 6, 7, 8]))).toEqual(new Set(['R', 'D']));
      expect(eightPuzzle.getActions(List([1, 0, 2, 3, 4, 5, 6, 7, 8]))).toEqual(new Set(['L', 'R', 'D']));
      expect(eightPuzzle.getActions(List([1, 2, 0, 3, 4, 5, 6, 7, 8]))).toEqual(new Set(['L', 'D']));
      expect(eightPuzzle.getActions(List([1, 2, 3, 0, 4, 5, 6, 7, 8]))).toEqual(new Set(['U', 'R', 'D']));
      expect(eightPuzzle.getActions(List([1, 2, 3, 4, 0, 5, 6, 7, 8]))).toEqual(new Set(['U', 'L', 'R', 'D']));
      expect(eightPuzzle.getActions(List([1, 2, 3, 4, 5, 0, 6, 7, 8]))).toEqual(new Set(['U', 'L', 'D']));
      expect(eightPuzzle.getActions(List([1, 2, 3, 4, 5, 6, 0, 7, 8]))).toEqual(new Set(['U', 'R']));
      expect(eightPuzzle.getActions(List([1, 2, 3, 4, 5, 6, 7, 0, 8]))).toEqual(new Set(['U', 'L', 'R']));
      expect(eightPuzzle.getActions(List([1, 2, 3, 4, 5, 6, 7, 8, 0]))).toEqual(new Set(['U', 'L']));
    })

    test('action results', () => {
      expect(eightPuzzle.getActionResult(List([0, 1, 2, 3, 4, 5, 6, 7, 8]), 'R')).toEqual(List([1, 0, 2, 3, 4, 5, 6, 7, 8]));
      expect(eightPuzzle.getActionResult(List([0, 1, 2, 3, 4, 5, 6, 7, 8]), 'D')).toEqual(List([3, 1, 2, 0, 4, 5, 6, 7, 8]));
      expect(eightPuzzle.getActionResult(List([1, 0, 2, 3, 4, 5, 6, 7, 8]), 'L')).toEqual(List([0, 1, 2, 3, 4, 5, 6, 7, 8]));
      expect(eightPuzzle.getActionResult(List([1, 2, 3, 4, 0, 5, 6, 7, 8]), 'U')).toEqual(List([1, 0, 3, 4, 2, 5, 6, 7, 8]));
    })

    test('goal', () => {
      expect(eightPuzzle.isGoal(List([1, 2, 3, 4, 5, 6, 7, 8, 0]))).toBe(true);
      expect(eightPuzzle.isGoal(List([0, 1, 2, 3, 4, 5, 6, 7, 8]))).toBe(false);
    })

    test('solvable', () => {
      expect(SlidingTiles.isSolvable(List([0, 1, 2, 3, 4, 5, 6, 7, 8]))).toBe(true);
      expect(SlidingTiles.isSolvable(List([1, 2, 3, 4, 5, 6, 7, 8, 0]))).toBe(true);
      expect(SlidingTiles.isSolvable(List([1, 2, 3, 4, 0, 6, 7, 5, 8]))).toBe(true);
      expect(SlidingTiles.isSolvable(List([1, 2, 3, 4, 5, 6, 8, 7, 0]))).toBe(false);
      expect(SlidingTiles.isSolvable(List([8, 1, 2, 0, 4, 3, 7, 6, 5]))).toBe(false);
    })

    test('misplaced tiles heuristic', () => {
      expect(eightPuzzle.misplacedTilesHeuristic(List([1, 2, 3, 4, 5, 6, 7, 8, 0]))).toBe(0);
      expect(eightPuzzle.misplacedTilesHeuristic(List([1, 2, 3, 4, 5, 6, 7, 0, 8]))).toBe(1);
      expect(eightPuzzle.misplacedTilesHeuristic(List([1, 2, 3, 4, 5, 6, 0, 7, 8]))).toBe(2);
      expect(eightPuzzle.misplacedTilesHeuristic(List([3, 1, 2, 6, 4, 5, 0, 7, 8]))).toBe(8);
      expect(eightPuzzle.misplacedTilesHeuristic(List([0, 1, 2, 3, 4, 5, 6, 7, 8]))).toBe(8);
    })

    test('manhattan distance heuristic', () => {
      expect(eightPuzzle.manhattanDistanceHeuristic(List([1, 2, 3, 4, 5, 6, 7, 8, 0]))).toBe(0);
      expect(eightPuzzle.manhattanDistanceHeuristic(List([1, 2, 3, 4, 5, 6, 7, 0, 8]))).toBe(1);
      expect(eightPuzzle.manhattanDistanceHeuristic(List([0, 1, 2, 3, 4, 5, 6, 7, 8]))).toBe(12);
      expect(eightPuzzle.manhattanDistanceHeuristic(List([7, 2, 4, 5, 0, 6, 8, 3, 1]))).toBe(14);
    })

    test('action cost', () => {
      expect(eightPuzzle.getActionCost(List([1, 2, 3, 4, 5, 6, 7, 0, 8]), 'R', List([1, 2, 3, 4, 5, 6, 7, 8, 0]))).toBe(1);
    })
  })
})

// Unit tests for the search algorithms run on the SlidingTiles problem
describe('algorithms', () => {
  const eightPuzzle1 = new SlidingTiles({initialState: List([1, 2, 3, 4, 5, 6, 0, 7, 8]), goalState: List([1, 2, 3, 4, 5, 6, 7, 8, 0])});
  const eightPuzzle2 = new SlidingTiles({initialState: List([4, 1, 3, 2, 6, 8, 7, 5, 0]), goalState: List([1, 2, 3, 4, 5, 6, 7, 8, 0])});
  const eightPuzzle3 = new SlidingTiles({initialState: List([7, 1, 6, 3, 0, 4, 5, 8, 2]), goalState: List([1, 2, 3, 4, 5, 6, 7, 8, 0])});
  const eightPuzzle4 = new SlidingTiles({initialState: List([3, 1, 6, 5, 8, 7, 0, 2, 4]), goalState: List([1, 2, 3, 4, 5, 6, 7, 8, 0])});
  const eightPuzzle5 = new SlidingTiles({initialState: List([4, 2, 1, 6, 0, 5, 3, 8, 7]), goalState: List([1, 2, 3, 4, 5, 6, 7, 8, 0])});

  // A* uses best first search best first search algorithm implicitly (f = g + h)
  describe('A*', () => {
    test('puzzle 1', () => {
      expect(new AStarSearch(eightPuzzle1.misplacedTilesHeuristic.bind(eightPuzzle1)).findSolution(eightPuzzle1)?.pathCost).toBe(2);
      expect(new AStarSearch(eightPuzzle1.manhattanDistanceHeuristic.bind(eightPuzzle1)).findSolution(eightPuzzle1)?.pathCost).toBe(2);
    })
    test('puzzle 2', () => {
      expect(new AStarSearch(eightPuzzle2.misplacedTilesHeuristic.bind(eightPuzzle2)).findSolution(eightPuzzle2)?.pathCost).toBe(8);
      expect(new AStarSearch(eightPuzzle2.manhattanDistanceHeuristic.bind(eightPuzzle2)).findSolution(eightPuzzle2)?.pathCost).toBe(8);
    })
    test('puzzle 3', () => {
      expect(new AStarSearch(eightPuzzle3.misplacedTilesHeuristic.bind(eightPuzzle3)).findSolution(eightPuzzle3)?.pathCost).toBe(16);
      expect(new AStarSearch(eightPuzzle3.manhattanDistanceHeuristic.bind(eightPuzzle3)).findSolution(eightPuzzle3)?.pathCost).toBe(16);
    })
    test('puzzle 4', () => {
      expect(new AStarSearch(eightPuzzle4.misplacedTilesHeuristic.bind(eightPuzzle4)).findSolution(eightPuzzle4)?.pathCost).toBe(22);
      expect(new AStarSearch(eightPuzzle4.manhattanDistanceHeuristic.bind(eightPuzzle4)).findSolution(eightPuzzle4)?.pathCost).toBe(22);
    })
    test('puzzle 5', () => {
      expect(new AStarSearch(eightPuzzle5.misplacedTilesHeuristic.bind(eightPuzzle5)).findSolution(eightPuzzle5)?.pathCost).toBe(24);
      expect(new AStarSearch(eightPuzzle5.manhattanDistanceHeuristic.bind(eightPuzzle5)).findSolution(eightPuzzle5)?.pathCost).toBe(24);
    })
  })

  // Greedy uses best first search algorithm implicitly (f = h)
  describe('greedy', () => {
    test('puzzle 1', () => {
      expect(new GreedySearch(eightPuzzle1.misplacedTilesHeuristic.bind(eightPuzzle1)).findSolution(eightPuzzle1)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
      expect(new GreedySearch(eightPuzzle1.manhattanDistanceHeuristic.bind(eightPuzzle1)).findSolution(eightPuzzle1)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    })
    test('puzzle 2', () => {
      expect(new GreedySearch(eightPuzzle2.misplacedTilesHeuristic.bind(eightPuzzle2)).findSolution(eightPuzzle2)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
      expect(new GreedySearch(eightPuzzle2.manhattanDistanceHeuristic.bind(eightPuzzle2)).findSolution(eightPuzzle2)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    })
    test('puzzle 3', () => {
      expect(new GreedySearch(eightPuzzle3.misplacedTilesHeuristic.bind(eightPuzzle3)).findSolution(eightPuzzle3)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
      expect(new GreedySearch(eightPuzzle3.manhattanDistanceHeuristic.bind(eightPuzzle3)).findSolution(eightPuzzle3)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    })
    test('puzzle 4', () => {
      expect(new GreedySearch(eightPuzzle4.misplacedTilesHeuristic.bind(eightPuzzle4)).findSolution(eightPuzzle4)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
      expect(new GreedySearch(eightPuzzle4.manhattanDistanceHeuristic.bind(eightPuzzle4)).findSolution(eightPuzzle4)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    })
    test('puzzle 5', () => {
      expect(new GreedySearch(eightPuzzle5.misplacedTilesHeuristic.bind(eightPuzzle5)).findSolution(eightPuzzle5)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
      expect(new GreedySearch(eightPuzzle5.manhattanDistanceHeuristic.bind(eightPuzzle5)).findSolution(eightPuzzle5)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    })
  })

  // Uniform cost search uses best first search algorithm implicitly (f = g)
  describe('uniform cost', () => {
    test('puzzle 1', () => {
      expect(new UniformCostSearch().findSolution(eightPuzzle1)?.pathCost).toBe(2);
    })
    test('puzzle 2', () => {
      expect(new UniformCostSearch().findSolution(eightPuzzle2)?.pathCost).toBe(8);
    })
    test('puzzle 3', () => {
      expect(new UniformCostSearch().findSolution(eightPuzzle3)?.pathCost).toBe(16);
    })
    test('puzzle 4', () => {
      expect(new UniformCostSearch().findSolution(eightPuzzle4)?.pathCost).toBe(22);
    })
    test('puzzle 5', () => {
      expect(new UniformCostSearch().findSolution(eightPuzzle5)?.pathCost).toBe(24);
    })
  })

  describe('breadth first', () => {
    // Each step costs 1 in the sliding tiles puzzle - we can test the optimal path cost
    test('puzzle 1', () => {
      expect(new BreadthFirstSearch().findSolution(eightPuzzle1)?.pathCost).toBe(2);
    })
    test('puzzle 2', () => {
      expect(new BreadthFirstSearch().findSolution(eightPuzzle2)?.pathCost).toBe(8);
    })
    test('puzzle 3', () => {
      expect(new BreadthFirstSearch().findSolution(eightPuzzle3)?.pathCost).toBe(16);
    })
    test('puzzle 4', () => {
      expect(new BreadthFirstSearch().findSolution(eightPuzzle4)?.pathCost).toBe(22);
    })
    test('puzzle 5', () => {
      expect(new BreadthFirstSearch().findSolution(eightPuzzle5)?.pathCost).toBe(24);
    })
  })

  describe('depth first', () => {
    test('puzzle 1', () => {
      expect(new DepthFirstSearch().findSolution(eightPuzzle1)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    })
    test('puzzle 2', () => {
      expect(new DepthFirstSearch().findSolution(eightPuzzle2)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    })
    test('puzzle 3', () => {
      expect(new DepthFirstSearch().findSolution(eightPuzzle3)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    })
    test('puzzle 4', () => {
      expect(new DepthFirstSearch().findSolution(eightPuzzle4)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    })
    test('puzzle 5', () => {
      expect(new DepthFirstSearch().findSolution(eightPuzzle5)?.state).toEqual(List([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    })
  })
})

