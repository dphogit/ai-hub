import { hideElement, PuzzleBoard, showElement } from "./ui";
import {
  AStarSearch,
  ExpansionListener,
  GreedySearch, HeuristicFunction,
  Puzzle,
  PuzzleAction,
  SlidingTiles,
  UniformCostSearch
} from "./search";
import SearchAlgorithm from "./search/algorithms/SearchAlgorithm";

const boardElement = document.querySelector('.board') as HTMLDivElement;
const scrambleBtn = document.querySelector('.controls__button--scramble') as HTMLButtonElement;
const solveBtn = document.querySelector('.controls__button--solve') as HTMLButtonElement;
const expansionCounter = document.querySelector('.stats__count') as HTMLParagraphElement;
const algoSelectEl = document.querySelector('#algorithm') as HTMLSelectElement;
const heuristicSelectEl = document.querySelector('#heuristic') as HTMLSelectElement;
const heuristicControl = document.querySelector('.controls__dropdown--heuristic') as HTMLDivElement;

const board = new PuzzleBoard(boardElement);

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

function getHeuristic(stProblem: SlidingTiles): HeuristicFunction<Puzzle> {
  const selectedHeuristic = heuristicSelectEl.options[heuristicSelectEl.selectedIndex].value;
  switch(selectedHeuristic) {
    case 'Manhattan Distance':
      return stProblem.manhattanDistanceHeuristic.bind(stProblem);
    case 'Misplaced Tiles':
      return stProblem.misplacedTilesHeuristic.bind(stProblem);
    default:
      console.error('No selected heuristic - default to Manhattan Distance');
      return stProblem.manhattanDistanceHeuristic.bind(stProblem);
  }
}

function constructProblemSearch(stProblem: SlidingTiles): SearchAlgorithm<Puzzle, PuzzleAction> {
  const selectedAlgorithm = algoSelectEl.options[algoSelectEl.selectedIndex].value;

  // Check for uninformed search algorithms before getting heuristic
  if (selectedAlgorithm === 'Uniform Cost') {
    return new UniformCostSearch<Puzzle, PuzzleAction>();
  }

  // Informed search algorithms
  const heuristic = getHeuristic(stProblem);
  switch (selectedAlgorithm) {
    case 'A*':
      return new AStarSearch<Puzzle, PuzzleAction>(heuristic);
    case 'Greedy':
        return new GreedySearch<Puzzle, PuzzleAction>(heuristic);
    default:
      console.error('No selected algorithm - default to A*');
      return new AStarSearch<Puzzle, PuzzleAction>(heuristic);
  }
}

function onAlgoChange() {
  const selectedAlgorithm = algoSelectEl.options[algoSelectEl.selectedIndex].value;
  if (selectedAlgorithm === 'Uniform Cost') {
    hideElement(heuristicControl);
  } else {
    showElement(heuristicControl);
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

    const searchAlgo = constructProblemSearch(stProblem);
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
algoSelectEl.addEventListener('change', onAlgoChange);
