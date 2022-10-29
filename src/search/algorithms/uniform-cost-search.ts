import { SearchProblem} from "../core";
import { bestFirstSearch } from "./best-first-search";

/**
 * Uniform cost search is a specific best-first search algorithm with the evaluation function
 * of f(n) = g(n) where g(n) is the cost of the path from the initial state to the node n. It is a
 * variant of Dijkstra's algorithm.
 *
 * This is an uninformed search algorithm. It is guaranteed to find the optimal solution but memory intensive.
 *
 * <a href="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Practical_optimizations_and_infinite_graphs">Uniform cost search</a>
 *
 * @param problem       The search problem to solve.
 * @param isTreeSearch  Whether to use a tree search (repeated states are NOT checked).
 *                      Defaults to false (graph search).
 */
export function uniformCostSearch<S, A>(problem: SearchProblem<S, A>, isTreeSearch = false) {
  return bestFirstSearch(problem, (node) => node.pathCost, !isTreeSearch);
}