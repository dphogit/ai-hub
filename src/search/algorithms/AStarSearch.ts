import { HeuristicFunction } from "../types";
import { BestFirstSearch } from "./BestFirstSearch";

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