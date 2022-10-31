import { PuzzleBoard } from "./ui";
import { Puzzle, PuzzleAction, UniformCostSearch } from "./search";
import SearchAlgorithm from "./search/algorithms/SearchAlgorithm";

const boardElement = document.querySelector('.board');
if (!boardElement) throw new Error('Could not find board element');

const board = new PuzzleBoard(boardElement);

function onClickScramble(board: PuzzleBoard) {
  return () => {
    board.scramble();
  }
}

const scrambleBtn = document.querySelector('.controls__button--scramble');
if (!scrambleBtn) throw new Error('Could not find scramble button');
scrambleBtn.addEventListener('click', onClickScramble(board));

const solveBtn = document.querySelector('.controls__button--solve');
if (!solveBtn) throw new Error('Could not find solve button');

function onClickSolve(board: PuzzleBoard, algo: SearchAlgorithm<Puzzle, PuzzleAction>) {
  return (e: Event) => {
    console.log('Solving...');
    scrambleBtn?.setAttribute('disabled', 'true');
    solveBtn?.setAttribute('disabled', 'true');
    const solution = board.solve(algo);
    scrambleBtn?.removeAttribute('disabled');
    solveBtn?.removeAttribute('disabled');
    console.log('Solved!');
    console.log(solution);
  }
}
solveBtn.addEventListener('click', onClickSolve(board, new UniformCostSearch()));

