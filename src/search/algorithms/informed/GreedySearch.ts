import { HeuristicFunction } from "../../core";
import { BestFirstSearch } from "./BestFirstSearch";

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