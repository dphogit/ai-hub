import { HeuristicFunction } from "../types";
import { BestFirstSearch, bestFirstSearch } from "./BestFirstSearch";
import { SearchProblem, STNode } from "../core";
import SearchAlgorithm from "./SearchAlgorithm";

/**
 * A* search is a specific best-first search algorithm with the evaluation function
 * of f(n) = g(n) + h(n) where:
 * - g(n) is the cost of the path from the initial state to the node n
 * - h(n) is the heuristic function that estimates the cost of the cheapest path from n to a goal
 *
 * NOTE: If the heuristic function is defined as a problem class method,
 * you must bind the method to the same problem instance before passing it to this function.
 *
 * TODO Phase this out once class implementations are complete
 *
 * It is guaranteed to find the optimal solution if the heuristic function is admissible.
 *
 * <a href="https://en.wikipedia.org/wiki/A*_search_algorithm">A* Search</a>
 *
 * @param problem       The search problem to solve.
 * @param heuristicFn   The heuristic function to use to estimate the cost of the cheapest path
 *                      from n to a goal.
 * @param isTreeSearch  Whether to use a tree search (repeated states are NOT checked).
 *                      Defaults to false (graph search)
 */
export function aStarSearch<S, A>(
  problem: SearchProblem<S, A>,
  heuristicFn: HeuristicFunction<S>,
  isTreeSearch = false
) {
  return bestFirstSearch(problem, (node) => node.pathCost + heuristicFn(node.state), !isTreeSearch);
}

/**
 * A* is a specific best-first search algorithm with the evaluation function of f(n) = g(n) + h(n)
 * - g(n) is the cost of the path from the initial state to the node n
 * - h(n) is the heuristic function that estimates the cost of the cheapest path from n to a goal
 *
 * It is guaranteed to find the optimal solution if the heuristic function is admissible.
 *
 * Read more on <a href="https://en.wikipedia.org/wiki/A*_search_algorithm">A* Search</a>
 */
export class AStarSearch<S, A> extends BestFirstSearch<S, A> {

  /**
   * Create a new A* search algorithm.
   * @param heuristicFn   The heuristic function h(n), estimates cost of the cheapest path
   * @param isGraphSearch Whether to use a graph search (check repeated states). Default true.
   */
  constructor(public heuristicFn: HeuristicFunction<S>, isGraphSearch = true) {
    super(
      (node) => node.pathCost + heuristicFn(node.state),
      isGraphSearch
    );
  }
}