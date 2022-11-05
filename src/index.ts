import { hideElement, PuzzleBoard, showElement } from "./ui";
import {
  AStarSearch, BreadthFirstSearch, DepthFirstSearch,
  ExpansionListener,
  GreedySearch,
  HeuristicFunction, IDAStarSearch,
  Puzzle,
  PuzzleAction,
  SlidingTiles,
  UniformCostSearch
} from "./search";
import SearchAlgorithm from "./search/algorithms/SearchAlgorithm";
import { List } from "immutable";

// TODO More algorithms - BFS, DFS, IDA*, Hill Climbing

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

const overlayDiv = document.querySelector('.overlay') as HTMLDivElement;
const modalEl = document.querySelector('.modal') as HTMLDivElement;
const modalInput = document.querySelector('#custom-puzzle') as HTMLInputElement;
const modalCloseBtn = document.querySelector('.modal__close') as HTMLButtonElement;
const modalCancelBtn = document.querySelector('.modal__button--cancel') as HTMLButtonElement;
const modalConfirmBtn = document.querySelector('.modal__button--confirm') as HTMLButtonElement;
const modalError = document.querySelector('.modal__error') as HTMLParagraphElement;

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

function closeModal() {
  modalEl.classList.remove('modal--in');
  modalEl.classList.add('modal--out');
  overlayDiv.classList.remove('overlay--show');
  updateModalError('');
  hideElement(modalError);
}

function openModal() {
  modalEl.classList.remove('modal--out');
  modalEl.classList.add('modal--in');
  overlayDiv.classList.add('overlay--show');
}

function updateModalError(message: string) {
  modalError.textContent = message;
}

function validatePuzzleInput(value: string): Puzzle | null {
  const solution = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  const pool = new Set(solution);
  const split = value.split('');
  const puzzle = List(split.map((s) => parseInt(s)));

  if (puzzle.size !== solution.length) return null;

  puzzle.forEach((i) => {
    pool.delete(i);
  })

  if (pool.size !== 0) return null;

  return puzzle;
}

function onModalConfirm() {
  const value = modalInput.value.trim();
  if (value.length === 0) return;

  const puzzle = validatePuzzleInput(value);
  if (puzzle === null) {
    updateModalError('Invalid puzzle input');
    showElement(modalError);
    return;
  }

  if (!SlidingTiles.isSolvable(puzzle)) {
    updateModalError('Puzzle is not solvable');
    showElement(modalError);
    return;
  }

  board.update(puzzle);
  modalInput.value = '';
  closeModal();
}

function onKeypressModalInput(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    onModalConfirm();
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
  switch (selectedAlgorithm) {
    case 'Uniform Cost':
      return new UniformCostSearch<Puzzle, PuzzleAction>();
    case 'BFS':
      return new BreadthFirstSearch<Puzzle, PuzzleAction>();
  }

  // Informed search algorithms
  const heuristic = getHeuristic(stProblem);
  switch (selectedAlgorithm) {
    case 'A*':
      return new AStarSearch<Puzzle, PuzzleAction>(heuristic);
    case 'Greedy':
        return new GreedySearch<Puzzle, PuzzleAction>(heuristic);
    case 'IDA*':
      return new IDAStarSearch<Puzzle, PuzzleAction>(heuristic);
    default:
      console.error('No selected algorithm - default to A*');
      return new AStarSearch<Puzzle, PuzzleAction>(heuristic);
  }
}

function onAlgoChange() {
  const selectedAlgorithm = algoSelectEl.options[algoSelectEl.selectedIndex].value;
  switch (selectedAlgorithm) {
    case 'Uniform Cost':
    case 'BFS':
      hideElement(heuristicDiv);
      break;
    default:
      showElement(heuristicDiv);
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
          showStats(solutionPath.length - 1, expListener.getCount());
          enableOptions();
        }
      });
    }
  }
}

overlayDiv.addEventListener('click', closeModal);
customBtn.addEventListener('click', openModal);
modalInput.addEventListener('keypress', onKeypressModalInput);
modalCancelBtn.addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);
modalConfirmBtn.addEventListener('click', onModalConfirm);

algoSelectEl.addEventListener('change', onAlgoChange);

scrambleBtn.addEventListener('click', onClickScramble(board));
solveBtn.addEventListener('click', onClickSolve(board));
