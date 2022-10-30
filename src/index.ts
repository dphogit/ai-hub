import { createTile, generateRandomPuzzle } from "./ui";
import { Puzzle } from "./search";

function setupPuzzleBoard(puzzle: Puzzle) {
  const board = document.querySelector('.board__puzzle');
  if (!board) return;

  const n = Math.sqrt(puzzle.size);

  board.classList.add('board');
  board.setAttribute('style', `
    grid-template-columns: repeat(${n}, 1fr); 
    grid-template-rows: repeat(${n}, 1fr);
  `);

  puzzle.forEach((tile) => {
    board.appendChild(createTile(tile));
  });
}

function main() {
  const { solved, shuffled } = generateRandomPuzzle(3);
  setupPuzzleBoard(shuffled);
}

main();
