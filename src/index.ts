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

const algoSelectEl = document.querySelector('#algorithm') as HTMLSelectElement;
const heuristicDiv = document.querySelector('.controls__dropdown--heuristic') as HTMLDivElement;
const heuristicSelectEl = document.querySelector('#heuristic') as HTMLSelectElement;

const customBtn = document.querySelector('.controls__button--custom') as HTMLButtonElement;
const scrambleBtn = document.querySelector('.controls__button--scramble') as HTMLButtonElement;
const solveBtn = document.querySelector('.controls__button--solve') as HTMLButtonElement;

const statsDiv = document.querySelector('.stats') as HTMLDivElement;
const stepsCounterEl = document.querySelector('.stats__steps') as HTMLParagraphElement;
const expansionCounterEl = document.querySelector('.stats__expansions') as HTMLParagraphElement;

const board = new PuzzleBoard(boardElement);

function updateStepsCounter(length: number) {
  stepsCounterEl.textContent = 'Steps: ' + length.toString();
}

function updateExpansionCounter(count: number) {
  expansionCounterEl.textContent = 'Expansions: ' + count.toString();
}

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

function disableOptionDropdowns() {
  const dropDownsDiv = document.querySelectorAll('.controls__dropdown');
  dropDownsDiv.forEach((el) => {
    el.getElementsByTagName('select')[0].setAttribute('disabled', 'true');
  })
}

function enableOptionDropdowns() {
  const dropDowns = document.querySelectorAll('.controls__dropdown');
  dropDowns.forEach((el) => {
    el.getElementsByTagName('select')[0].removeAttribute('disabled');
  })
}

function disableOptionButtons() {
  const buttons = document.querySelectorAll('.controls__button');
  buttons.forEach((el) => {
    el.setAttribute('disabled', 'true');
  })
}

function enableOptionButtons() {
  const buttons = document.querySelectorAll('.controls__button');
  buttons.forEach((el) => {
    el.removeAttribute('disabled');
  })
}

function disableOptions() {
  disableOptionDropdowns();
  disableOptionButtons()
}

function enableOptions() {
  enableOptionDropdowns();
  enableOptionButtons();
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
    hideElement(heuristicDiv);
  } else {
    showElement(heuristicDiv);
  }
}

function onClickCustom() {
  // TODO Implement me
}

function onClickScramble(board: PuzzleBoard) {
  return () => {
    board.scramble();
    hideStats();
  }
}

function onClickSolve(board: PuzzleBoard) {
  return () => {
    disableOptions();

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
          enableOptions();
        }
      });
    }
  }
}

scrambleBtn.addEventListener('click', onClickScramble(board));
solveBtn.addEventListener('click', onClickSolve(board));
algoSelectEl.addEventListener('change', onAlgoChange);
