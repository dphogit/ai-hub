import { Puzzle, SlidingTiles } from "../search";
import { generateRandomPuzzle } from "./util";

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

    const n = Math.sqrt(this.puzzle.size);
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
    const { solved, shuffled } = generateRandomPuzzle(3);
    this.puzzle = shuffled;
    this.solution = solved;
    this.update(shuffled);
  }
}