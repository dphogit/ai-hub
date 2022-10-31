import { Puzzle, PuzzleAction, SlidingTiles } from "../search";
import { generateRandomPuzzle } from "./util";
import SearchAlgorithm from "../search/algorithms/SearchAlgorithm";

function createTile(val: number) {
  const tile = document.createElement('div');
  tile.classList.add('board__tile');

  if (val === SlidingTiles.BLANK_TILE) {
    tile.classList.add('board__tile--blank');
  } else {
    tile.id = `tile-${val}`;
    tile.textContent = val.toString();
    tile.classList.add('board__tile--number');
  }

  return tile;
}

export class PuzzleBoard {
  puzzle: Puzzle;
  solution: Puzzle;

  constructor(public boardEl: Element) {
    const { solved, shuffled } = generateRandomPuzzle(3);
    this.puzzle = shuffled;
    this.solution = solved;

    this.populate(shuffled);
  }

  clear() {
    while (this.boardEl.firstChild) {
      this.boardEl.removeChild(this.boardEl.firstChild);
    }
  }

  populate(puzzle: Puzzle) {
    const n = Math.sqrt(puzzle.size);
    this.boardEl.setAttribute('style', `
      grid-template-columns: repeat(${n}, 1fr); 
      grid-template-rows: repeat(${n}, 1fr);
    `);
    puzzle.forEach((tile) => {
      this.boardEl.appendChild(createTile(tile));
    });
  }

  update(puzzle: Puzzle) {
    this.clear();
    this.populate(puzzle);
  }

  scramble() {
    const { solved, shuffled } = generateRandomPuzzle(3);
    this.puzzle = shuffled;
    this.solution = solved;
    this.update(shuffled);
  }

  solve(algo: SearchAlgorithm<Puzzle, PuzzleAction>) {
    const slidingTiles = new SlidingTiles({ initialState: this.puzzle, goalState: this.solution });
    const solutionNode = algo.findSolution(slidingTiles);
    if (solutionNode) {
      this.update(solutionNode.state);
      return solutionNode;
    }
    return null;
  }
}