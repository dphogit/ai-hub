import { HeuristicFunction, SearchProblem } from "../core";
import { bestFirstSearch } from "./best-first-search";

/**
 * Greedy best first search is a specific best-first search algorithm with the evaluation function
 * of f(n) = h(n) where h(n) is the heuristic function that estimates the cost of the cheapest path
 * from n to a goal.
 *
 * NOTE: If the heuristic function is defined as a problem class method,
 * you must bind the method to the same problem instance before passing it to this function.
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