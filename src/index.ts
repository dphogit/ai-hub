import { hideElement, PuzzleBoard, showElement } from "./ui";
import { AStarSearch, ExpansionListener, Puzzle, PuzzleAction, SlidingTiles } from "./search";

const boardElement = document.querySelector('.board');
if (!boardElement) throw new Error('Could not find board element');

const board = new PuzzleBoard(boardElement);

const scrambleBtn = document.querySelector('.controls__button--scramble');
if (!scrambleBtn) throw new Error('Could not find scramble button');

const solveBtn = document.querySelector('.controls__button--solve');
if (!solveBtn) throw new Error('Could not find solve button');

const expansionCounter = document.querySelector('.stats__count');
if (!expansionCounter) throw new Error('Could not find counter element');

function updateExpansionCounter(count: number) {
  if (expansionCounter) expansionCounter.textContent = 'Expansions: ' + count.toString();
}

function hideAndResetExpansionCounter() {
  if (expansionCounter) {
    updateExpansionCounter(0);
    hideElement(expansionCounter)
  }
}

function showAndUpdateExpansionCounter(count: number) {
  if (expansionCounter) {
    updateExpansionCounter(count);
    showElement(expansionCounter);
  }
}

function onClickScramble(board: PuzzleBoard) {
  return () => {
    board.scramble();
    hideAndResetExpansionCounter();
  }
}

function onClickSolve(board: PuzzleBoard) {
  return () => {
    scrambleBtn?.setAttribute('disabled', 'true');
    solveBtn?.setAttribute('disabled', 'true');

    const stProblem = new SlidingTiles({
      initialState: board.puzzle,
      goalState: board.solution
    });

    // TODO Add ability to configure search algorithm
    const searchAlgo = new AStarSearch<Puzzle, PuzzleAction>(stProblem.manhattanDistanceHeuristic.bind(stProblem));
    const expListener = new ExpansionListener();
    searchAlgo.addNodeListener(expListener);

    // TODO Display feedback while solving (e.g loading sign)
    const solution = searchAlgo.findSolution(stProblem);
    if (solution) {
      board.displaySteps({
        path: solution.path(),
        onComplete: () => {
          showAndUpdateExpansionCounter(expListener.getCount());
          scrambleBtn?.removeAttribute('disabled');
          solveBtn?.removeAttribute('disabled');
        }
      });
    }
  }
}

scrambleBtn.addEventListener('click', onClickScramble(board));
solveBtn.addEventListener('click', onClickSolve(board));

