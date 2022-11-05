import SearchAlgorithm from "../SearchAlgorithm";
import { HeuristicFunction, SearchProblem, STNode } from "../../core";

/**
 * Iterative deepening A* search is a variant of iterative deepening depth-first
 * search that borrows the idea to use a heuristic function to evaluate the
 * remaining cost to get to the goal from the A* search algorithm. It's
 * advantage over traditional A* search is that it only stores the nodes in
 * memory that are on the current path, resulting in linear memory usage
 * which is better than the exponential memory usage of A* search.
 *
 * Read more on <a href="https://en.wikipedia.org/wiki/Iterative_deepening_A*">Iterative Deepening A*</a>
 */
export class IDAStarSearch<S, A> extends SearchAlgorithm<S, A> {
  private static FOUND = -1;

  private problem: SearchProblem<S, A> | undefined;

  constructor(public heuristicFn: HeuristicFunction<S>) {
    super();
  }

  findSolution(problem: SearchProblem<S, A>) {
    this.problem = problem;
    const root = new STNode<S, A>(problem.initialState);
    let bound = this.heuristicFn(root.state);
    const path = [root];

    while (true) {
      const candidate = this.search(path, bound);
      if (candidate === IDAStarSearch.FOUND) return path[path.length - 1];
      if (candidate === Number.POSITIVE_INFINITY) return null;
      bound = candidate;
    }
  }

  /**
   * Recursive search function that returns the best path found so far.
   *
   * @param path    The current path
   * @param bound   A bound value used to prune the search
   */
  private search(path: STNode<S, A>[], bound: number): number {
    if (!this.problem) throw new Error("Problem is undefined");

    const node = path[path.length - 1];
    const f = node.pathCost + this.heuristicFn(node.state);

    if (f > bound) return f;
    if (this.problem.isGoal(node.state)) return IDAStarSearch.FOUND;

    let min = Number.POSITIVE_INFINITY;
    this.notifyNodeListeners(node);
    for (let child of node.expand(this.problem)) {
      if (path.includes(child)) continue;

      path.push(child);

      const candidate = this.search(path, bound);

      if (candidate === IDAStarSearch.FOUND) return IDAStarSearch.FOUND;
      if (candidate < min) min = candidate;

      path.pop();
    }
    return min;
  }
}