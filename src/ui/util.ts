import { Puzzle, SlidingTiles } from "../search";
import { List } from "immutable";

function createSolvedPuzzle(n: number): Puzzle {
   const puzzle = [];
    for (let i = 1; i < n * n; i++) {
      puzzle.push(i);
    }
    puzzle.push(SlidingTiles.BLANK_TILE);
    return List(puzzle);
}

function shufflePuzzle(puzzle: Puzzle): Puzzle {
  const shuffled = puzzle.toArray();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return List(shuffled);
}

export function generateRandomPuzzle(n: number) {
  const solved = createSolvedPuzzle(n);
  while (true) {
    const shuffled = shufflePuzzle(solved);
    if (SlidingTiles.isSolvable(shuffled)) return { solved, shuffled };
  }
}
