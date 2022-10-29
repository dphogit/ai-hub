import { SearchProblem } from "../core";

type STState = number[];
type STAction = "U" | "L" | "R" | "D";

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
 * TODO Use immutable list from library.
 */
export class SlidingTiles extends SearchProblem<STState, STAction> {

  static BLANK_TILE = 0;

  n: number;

  // Only one specific goal state
  constructor(config: { initialState: STState, goalState: STState }) {
    super(config);
    this.n = Math.sqrt(config.initialState.length);
  }

  private static swapTiles(state: STState, i1: number, i2: number): void {
    const temp = state[i1];
    state[i1] = state[i2];
    state[i2] = temp;
  }

  // Calculate the index delta to move the empty tile within in the array
  private calcDelta(action: STAction): number {
    return {'U': -this.n, 'D': this.n, 'L': -1, 'R': 1}[action];
  }

  // Cost of moving a tile is always 1
  getActionCost(state1: STState, action: STAction, state2: STState): number {
    return 1;
  }

  // Swap the empty tile with the tile in the given direction
  getActionResult(state: STState, action: STAction): STState {
    const newState = [...state];
    const blankIndex = state.indexOf(SlidingTiles.BLANK_TILE);
    const neighbourIndex = blankIndex + this.calcDelta(action);

    SlidingTiles.swapTiles(newState, blankIndex, neighbourIndex)

    return newState;
  }

  // Only return actions that will not move the empty tile out of bounds
  getActions(state: STState): Set<STAction> {
    const possibleActions = new Set<STAction>(['U', 'D', 'L', 'R']);
    const emptyTileIndex = state.indexOf(0);

    const isOnTopRow = emptyTileIndex < this.n;
    const isOnBottomRow = emptyTileIndex >= state.length - this.n;
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
  static isSolvable(state: STState): boolean {
    let inversions = 0;

    for (let i = 0; i < state.length; i++) {
      for (let j = i + 1; j < state.length; j++) {
        if (state[i] !== 0 && state[j] !== 0 && state[i] > state[j]) {
          inversions++;
        }
      }
    }

    return inversions % 2 === 0;
  }

  isGoal(state: STState): boolean {
    return this.goalState !== undefined && this.goalState.every((val, i) => val === state[i]);
  }

  // Counts the number of tiles that are not in their correct position (excl. blank tile)
  misplacedTilesHeuristic(state: STState): number {
    return state.reduce((acc, val, i) => {
      if (!this.goalState) {
        throw new Error('Goal state is not defined - for this problem a goal state is required');
      }

      const isBlankTile = val === SlidingTiles.BLANK_TILE;
      const isSameTile = val === this.goalState[i];
      return !isBlankTile && !isSameTile ? acc + 1 : acc;
    }, 0);
  }

  // Counts the sum of the manhattan distances of each tile from its correct position
  manhattanDistanceHeuristic(state: STState): number {
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
