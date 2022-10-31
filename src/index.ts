import { PuzzleBoard } from "./ui";
import { AStarSearch, NodeListener, Puzzle, PuzzleAction, SlidingTiles, UniformCostSearch } from "./search";

const boardElement = document.querySelector('.board');
if (!boardElement) throw new Error('Could not find board element');

const board = new PuzzleBoard(boardElement);

const scrambleBtn = document.querySelector('.controls__button--scramble');
if (!scrambleBtn) throw new Error('Could not find scramble button');

const solveBtn = document.querySelector('.controls__button--solve');
if (!solveBtn) throw new Error('Could not find solve button');

const expansionCounter = document.querySelector('#expansion-counter');
if (!expansionCounter) throw new Error('Could not find counter element');

function updateExpansionCounter(count: number) {
  if (expansionCounter) expansionCounter.textContent = count.toString();
}

function onClickScramble(board: PuzzleBoard) {
  return () => {
    board.scramble();
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

      let expansions = 0;
      const listener: NodeListener<Puzzle, PuzzleAction> = {
        update: (node) => {
          expansions++;
          if (expansions % 10000 === 0) {
            updateExpansionCounter(expansions);
          }
        }
      }

      // TODO Create input dropdown for selecting search algorithm
      // const searchAlgo = new AStarSearch<Puzzle, PuzzleAction>(stProblem.manhattanDistanceHeuristic.bind(stProblem));
      const searchAlgo = new UniformCostSearch<Puzzle, PuzzleAction>();
      searchAlgo.addNodeListener(listener);

      // FIXME - Is blocking the UI thread - need to use web workers
      const solution = searchAlgo.findSolution(stProblem);
      if (solution) {
        board.update(solution.state);
        updateExpansionCounter(expansions);
      } else {
        console.error('Failed to find solution');
        alert('Failed to find solution');
      }

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

