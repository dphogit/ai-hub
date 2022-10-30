import { createTile, generateRandomPuzzle } from "./ui";

function setupPuzzleBoard(puzzle: number[]) {
  const board = document.querySelector('.board__puzzle');
  if (!board) return;

  const n = Math.sqrt(puzzle.length);

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
  const puzzle = generateRandomPuzzle(3);
  setupPuzzleBoard(puzzle);
}

main();
