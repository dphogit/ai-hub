import { PuzzleBoard } from "./ui";
import { AStarSearch, Puzzle, PuzzleAction, SlidingTiles, STNode } from "./search";
import { ExpansionListener } from "./search/listeners/ExpansionListener";

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

function showElement(el: Element) {
  el.classList.remove('hide');
  el.classList.add('show');
}

function hideElement(el: Element) {
  el.classList.remove('show');
  el.classList.add('hide');
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

function animateSolution(board: PuzzleBoard, solution: STNode<Puzzle, PuzzleAction>, onComplete?: () => void) {
  const solutionPath = solution.path();
  const interval = setInterval(() => {
    const node = solutionPath.shift();
    if (node) {
      board.update(node.state)
    } else {
      onComplete && onComplete();
      clearInterval(interval);
    }
  }, 200);
}

function onClickScramble(board: PuzzleBoard) {
  return () => {
    board.scramble();
    hideAndResetExpansionCounter();
  }
}

function onClickSolve(board: PuzzleBoard) {
  return () => {
    try {
      scrambleBtn?.setAttribute('disabled', 'true');
      solveBtn?.setAttribute('disabled', 'true');

      const stProblem = new SlidingTiles({
        initialState: board.puzzle,
        goalState: board.solution
      });

      const expListener = new ExpansionListener();

      // TODO Add ability to configure search algorithm
      const searchAlgo = new AStarSearch<Puzzle, PuzzleAction>(stProblem.manhattanDistanceHeuristic.bind(stProblem));
      searchAlgo.addNodeListener(expListener);

      // TODO Display feedback while solving (e.g loading sign)
      const solution = searchAlgo.findSolution(stProblem);
      if (solution) animateSolution(board, solution, () => showAndUpdateExpansionCounter(expListener.getCount()));
      else alert('No solution found');  // Technically should never happen

    } catch(error) {
      console.error(error);
    } finally {
      scrambleBtn?.removeAttribute('disabled');
      solveBtn?.removeAttribute('disabled');
    }
  }
}

scrambleBtn.addEventListener('click', onClickScramble(board));
solveBtn.addEventListener('click', onClickSolve(board));

