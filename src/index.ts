import { SlidingTiles } from "./search";

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

function setupPuzzleBoard(tiles: number[]) {
  const board = document.querySelector('.board__puzzle');
  if (!board) return;

  const n = Math.sqrt(tiles.length);

  board.classList.add('board');
  board.setAttribute('style', `
    grid-template-columns: repeat(${n}, 1fr); 
    grid-template-rows: repeat(${n}, 1fr);
  `);

  tiles.forEach((tile) => {
    board.appendChild(createTile(tile));
  });
}

function main() {
  const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  setupPuzzleBoard(tiles);
}

main();
