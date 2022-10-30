import { aStarSearch, Puzzle, SlidingTiles } from "../search";
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

export function createPuzzleBoard() {
  const boardElement = document.querySelector('.board');
  const scrambleBtn = document.querySelector('.controls__button--scramble');
  const solveBtn = document.querySelector('.controls__button--solve');
  if (!boardElement || !scrambleBtn || !solveBtn) {
    throw new Error('Could not find elements');
  }

  return new PuzzleBoard(boardElement, scrambleBtn, solveBtn);
}

// TODO Update the UI during search - observer pattern?
export class PuzzleBoard {
  static DEFAULT_N = 3;

  puzzle: Puzzle;
  solution: Puzzle;

  constructor(
    public boardElement: Element,
    public scrambleBtn: Element,
    public solveBtn: Element,
    public n: number = PuzzleBoard.DEFAULT_N,
  ) {
    const { shuffled, solved } = generateRandomPuzzle(n);
    this.puzzle = shuffled;
    this.solution = solved;

    this.populateBoard(shuffled);
    this.scrambleBtn.addEventListener('click', this.scramble.bind(this));
    this.solveBtn.addEventListener('click', this.solve.bind(this));
  }

  scramble() {
    const { solved, shuffled } = generateRandomPuzzle(3);
    this.puzzle = shuffled;
    this.solution = solved;
    this.clearAndPopulateBoard(shuffled);
  }

  solve() {
    const slidingTiles = new SlidingTiles({ initialState: this.puzzle, goalState: this.solution });

    this.disableScramble();
    this.disableSolve();
    console.log('Solving...');

    try {
      const node = aStarSearch(slidingTiles, slidingTiles.misplacedTilesHeuristic.bind(slidingTiles));
      if (!node) {
        alert('No solution found');
        return;
      }
      this.clearAndPopulateBoard(node.state);
      console.log('Solved!');
    } catch (e) {
      console.error('Error solving puzzle');
      alert('Something went wrong during Solving!')
    } finally {
      this.enableScramble();
      this.enableSolve();
    }
  }

  clearBoard() {
    while (this.boardElement.firstChild) {
      this.boardElement.removeChild(this.boardElement.firstChild);
    }
  }

  populateBoard(puzzle: Puzzle) {
    const n = Math.sqrt(puzzle.size);

    this.boardElement.setAttribute('style', `
      grid-template-columns: repeat(${n}, 1fr); 
      grid-template-rows: repeat(${n}, 1fr);
    `);

    puzzle.forEach((tile) => {
      this.boardElement.appendChild(createTile(tile));
    });
  }

  clearAndPopulateBoard(puzzle: Puzzle) {
    this.clearBoard();
    this.populateBoard(puzzle);
  }

  enableScramble() {
    this.scrambleBtn?.removeAttribute('disabled');
  }

  disableScramble() {
    this.scrambleBtn?.setAttribute('disabled', 'true');
  }

  enableSolve() {
    this.solveBtn?.removeAttribute('disabled');
  }

  disableSolve() {
    this.solveBtn?.setAttribute('disabled', 'true');
  }
}
