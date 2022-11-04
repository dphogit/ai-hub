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

// TODO Extract configuration to a modal
// TODO Let user enter custom puzzle

const boardElement = document.querySelector('.board') as HTMLDivElement;
const scrambleBtn = document.querySelector('.controls__button--scramble') as HTMLButtonElement;
const solveBtn = document.querySelector('.controls__button--solve') as HTMLButtonElement;
const algoSelectEl = document.querySelector('#algorithm') as HTMLSelectElement;
const heuristicSelectEl = document.querySelector('#heuristic') as HTMLSelectElement;
const heuristicControl = document.querySelector('.controls__dropdown--heuristic') as HTMLDivElement;
const statsDiv = document.querySelector('.stats') as HTMLDivElement;
const stepsCounter = document.querySelector('.stats__steps') as HTMLParagraphElement;
const expansionCounter = document.querySelector('.stats__expansions') as HTMLParagraphElement;

const board = new PuzzleBoard(boardElement);

function showStats(steps: number, expansions: number) {
  updateStepsCounter(steps);
  updateExpansionCounter(expansions);
  showElement(statsDiv);
}

function hideStats() {
  updateExpansionCounter(0);
  updateStepsCounter(0);
  hideElement(statsDiv);
}

function updateStepsCounter(length: number) {
  stepsCounter.textContent = 'Steps: ' + length.toString();
}

function updateExpansionCounter(count: number) {
  expansionCounter.textContent = 'Expansions: ' + count.toString();
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
    console.log('Selected algorithm: ' + selectedAlgorithm);
    hideElement(heuristicControl);
  } else {
    showElement(heuristicControl);
  }
}

function onClickScramble(board: PuzzleBoard) {
  return () => {
    board.scramble();
    hideStats();
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

    const solution = searchAlgo.findSolution(stProblem);
    if (solution) {
      const solutionPath = solution.path();
      board.displaySteps({
        path: solutionPath,
        onComplete: () => {
          showStats(solutionPath.length, expListener.getCount());
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
