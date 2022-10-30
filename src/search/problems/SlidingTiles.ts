import { Puzzle, PuzzleAction, SearchProblem } from "../core";

/**
 * The sliding tiles' problem where the goal is to move the tiles around
 * on a nxn board to get them in the correct order.
 *
 * The state is a 1D array of numbers indicating the tiles' positions where 0
 * is the empty tile.
 *
 * An action is one of "U" | "D" | "L" | "R" where U is up, D is down, L is left
 * and R is right to indicate which way to move the empty/blank tile which will swap
 * with the tile in that direction.
 *
 */
export class SlidingTiles extends SearchProblem<Puzzle, PuzzleAction> {

  static BLANK_TILE = 0;

  n: number;

  // Only one specific goal state
  constructor(config: { initialState: Puzzle, goalState: Puzzle }) {
    super(config);
    this.n = Math.sqrt(config.initialState.size);
  }

  private static swapTiles(state: Puzzle, i1: number, i2: number): Puzzle {
    return state.withMutations(s => {
      const t1 = s.get(i1);
      const t2 = s.get(i2);
      if (t1 !== undefined && t2 !== undefined) {
        s.set(i1, t2).set(i2, t1);
      }
    })
  }

  // Calculate the index delta to move the empty tile within in the array
  private calcDelta(action: PuzzleAction): number {
    return {'U': -this.n, 'D': this.n, 'L': -1, 'R': 1}[action];
  }

  // Cost of moving a tile is always 1
  getActionCost(state1: Puzzle, action: PuzzleAction, state2: Puzzle): number {
    return 1;
  }

  // Swap the empty tile with the tile in the given direction
  getActionResult(state: Puzzle, action: PuzzleAction): Puzzle {
    const blankIndex = state.indexOf(SlidingTiles.BLANK_TILE);
    const neighbourIndex = blankIndex + this.calcDelta(action);
    return SlidingTiles.swapTiles(state, blankIndex, neighbourIndex)
  }

  // Only return actions that will not move the empty tile out of bounds
  getActions(state: Puzzle): Set<PuzzleAction> {
    const possibleActions = new Set<PuzzleAction>(['U', 'D', 'L', 'R']);
    const emptyTileIndex = state.indexOf(0);

    const isOnTopRow = emptyTileIndex < this.n;
    const isOnBottomRow = emptyTileIndex >= state.size - this.n;
    const isOnLeftColumn = emptyTileIndex % this.n === 0;
    const isOnRightColumn = emptyTileIndex % this.n === this.n - 1;

    if (isOnTopRow) {
      possibleActions.delete('U');
    }
    if (isOnBottomRow) {
      possibleActions.delete('D');
    }
    if (isOnLeftColumn) {
      possibleActions.delete('L');
    }
    if (isOnRightColumn) {
      possibleActions.delete('R');
    }

    return possibleActions;
  }

  // A state is solvable if the number of inversions is not odd (i.e. is even)
  static isSolvable(state: Puzzle): boolean {
    let inversions = 0;

    for (let i = 0; i < state.size; i++) {
      const iTile = state.get(i)!;
      if (iTile === SlidingTiles.BLANK_TILE) {
        continue;
      }

      for (let j = i + 1; j < state.size; j++) {
        const jTile = state.get(j)!;
        if (jTile !== SlidingTiles.BLANK_TILE && iTile > jTile) {
          inversions++;
        }
      }
    }

    return inversions % 2 === 0;
  }

  isGoal(state: Puzzle): boolean {
    return this.goalState !== undefined && this.goalState.every((val, i) => val === state.get(i));
  }

  // Counts the number of tiles that are not in their correct position (excl. blank tile)
  misplacedTilesHeuristic(state: Puzzle): number {
    return state.reduce((acc, val, i) => {
      if (!this.goalState) {
        throw new Error('Goal state is not defined - for this problem a goal state is required');
      }

      const isBlankTile = val === SlidingTiles.BLANK_TILE;
      const isSameTile = val === this.goalState.get(i);
      return !isBlankTile && !isSameTile ? acc + 1 : acc;
    }, 0);
  }

  // Counts the sum of the manhattan distances of each tile from its correct position
  manhattanDistanceHeuristic(state: Puzzle): number {
    return state.reduce((acc, val, i) => {
      if (!this.goalState) {
        throw new Error('Goal state is not defined - for this problem a goal state is required');
      }

      if (val === SlidingTiles.BLANK_TILE) {
        return acc;
      }

      const goalIndex = this.goalState.indexOf(val);
      const deltaVert = Math.abs(Math.floor(goalIndex / this.n) - Math.floor(i / this.n));
      const deltaHor = Math.abs((goalIndex % this.n) - (i % this.n));
      const manhattanDistance = deltaVert + deltaHor;
      return acc + manhattanDistance;
    }, 0);
  }
}
