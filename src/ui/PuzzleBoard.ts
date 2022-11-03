import { Puzzle, SlidingTiles, generateRandomPuzzle } from "../search";
import { DisplayStepsOptions } from "./types";

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
  static readonly DEFAULT_INTERVAL_MS = 200;
  static readonly DEFAULT_N = 3;

  puzzle: Puzzle;
  solution: Puzzle;

  constructor(public boardEl: Element, public n: number = PuzzleBoard.DEFAULT_N) {
    const { solved, shuffled } = generateRandomPuzzle(PuzzleBoard.DEFAULT_N);
    this.puzzle = shuffled;
    this.solution = solved;

    this.boardEl.setAttribute('style', `
      grid-template-columns: repeat(${n}, 1fr); 
      grid-template-rows: repeat(${n}, 1fr);
    `);
    this.populate(shuffled);
  }

  clear() {
    while (this.boardEl.firstChild) {
      this.boardEl.removeChild(this.boardEl.firstChild);
    }
  }

  populate(puzzle: Puzzle) {
    puzzle.forEach((tile) => {
      this.boardEl.appendChild(createTile(tile));
    });
  }

  update(puzzle: Puzzle) {
    this.puzzle = puzzle;
    this.clear();
    this.populate(puzzle);
  }

  scramble() {
    const { solved, shuffled } = generateRandomPuzzle(PuzzleBoard.DEFAULT_N);
    this.puzzle = shuffled;
    this.solution = solved;
    this.update(shuffled);
  }

  displaySteps({path, onComplete, interval}: DisplayStepsOptions) {
    const tempPath = [...path]; // We don't want to mutate original array
    const intervalId = setInterval(() => {
      const node = tempPath.shift();
      if (node) {
        this.update(node.state)
      } else {
        onComplete && onComplete();
        clearInterval(intervalId);
      }
    }, interval || PuzzleBoard.DEFAULT_INTERVAL_MS);
  }

}