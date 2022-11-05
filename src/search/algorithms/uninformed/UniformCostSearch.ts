import { BestFirstSearch } from "../informed/BestFirstSearch";

/**
 * Uniform cost search is a specific best-first search algorithm with the evaluation function
 * of f(n) = g(n) where g(n) is the cost of the path from the initial state to the node n. It is a
 * variant of Dijkstra's algorithm and is an uninformed search algorithm. It is guaranteed to
 * find the optimal solution but is not efficient compared to A* search.
 *
 * Read more on <a href="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Practical_optimizations_and_infinite_graphs">Uniform Cost Search</a>
 */
export class UniformCostSearch<S, A> extends BestFirstSearch<S, A> {

  /**
   * Create a new uniform cost search algorithm.
   * @param isGraphSearch Whether to use a graph search (check repeated states). Default true.
   */
  constructor(isGraphSearch = true) {
    super((node) => node.pathCost, isGraphSearch);
  }
}