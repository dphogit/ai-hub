import { SlidingTiles } from "../search";

export function createTile(val: number) {
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

function shufflePuzzle(puzzle: number[]) {
  for (let i = puzzle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];
  }
}

// Produce a random puzzle of size n x n
export function generateRandomPuzzle(n: number) {
  const puzzle = []
  for (let i = 0; i < n * n; i++) {
    puzzle.push(i);
  }
  shufflePuzzle(puzzle);
  return puzzle;
}