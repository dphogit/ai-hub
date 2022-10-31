import { HeuristicFunction, SearchProblem } from "../core";
import { BestFirstSearch, bestFirstSearch } from "./BestFirstSearch";

/**
 * Greedy best first search is a specific best-first search algorithm with the evaluation function
 * of f(n) = h(n) where h(n) is the heuristic function that estimates the cost of the cheapest path
 * from n to a goal.
 *
 * NOTE: If the heuristic function is defined as a problem class method,
 * you must bind the method to the same problem instance before passing it to this function.
 *
 * TODO Phase this out once class implementations are complete
 *
 * It finds a solution quickly, but it is not guaranteed to find the optimal solution.
 *
 * @param problem       The search problem to solve.
 * @param heuristicFn   The heuristic function to use to estimate the cost of the cheapest path
 * @param isTreeSearch  Whether to use a tree search (repeated states are NOT checked).
 *                      Defaults to false (graph search).
 */
export function greedySearch<S, A>(
  problem: SearchProblem<S, A>,
  heuristicFn: HeuristicFunction<S>,
  isTreeSearch = false
) {
  return bestFirstSearch(problem, (node) => heuristicFn(node.state), !isTreeSearch);
}

/**
 * Greedy best first search is a specific best-first search algorithm with the evaluation function
 * of f(n) = h(n) where h(n) is the heuristic function that estimates the cost of the cheapest path
 * from n to a goal. It finds a solution quickly, but does not guarantee an optimal solution.
 *
 * Read more on <a href="https://en.wikipedia.org/wiki/Greedy_algorithm">Greedy Search</a>
 */
export class GreedySearch<S, A> extends BestFirstSearch<S, A> {

  /**
   * Creates a new greedy best first search algorithm.
   * @param heuristicFn     The heuristic function to use to estimate the cost of the cheapest path.
   * @param isGraphSearch   Whether to use a graph search (check repeated states). Default true.
   */
  constructor(public heuristicFn: HeuristicFunction<S>, isGraphSearch = true) {
    super(
      node => heuristicFn(node.state),
      isGraphSearch
    );
  }
}