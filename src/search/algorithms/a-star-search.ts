import { HeuristicFunction } from "../types";
import { bestFirstSearch } from "./best-first-search";
import { SearchProblem } from "../core";

/**
 * A* search is a specific best-first search algorithm with the evaluation function
 * of f(n) = g(n) + h(n) where:
 * - g(n) is the cost of the path from the initial state to the node n
 * - h(n) is the heuristic function that estimates the cost of the cheapest path from n to a goal
 *
 * NOTE: If the heuristic function is defined as a problem class method,
 * you must bind the method to the same problem instance before passing it to this function.
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