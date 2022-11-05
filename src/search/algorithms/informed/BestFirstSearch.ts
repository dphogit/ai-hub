import { Heap } from "mnemonist";
import { Set } from "immutable";
import { EvaluationFunction, SearchProblem } from "../../core";
import { STNode } from "../../core";
import SearchAlgorithm from "../SearchAlgorithm";

/**
 * Best first search based which uses a priority queue based on an evaluation function
 * to pick the next node to expand.
 *
 * Read more on <a href="https://en.wikipedia.org/wiki/Best-first_search">Best First Search</a>
 */
export class BestFirstSearch<S, A> extends SearchAlgorithm<S, A> {

  /**
   * Create a new best first search algorithm.
   * @param evalFn          The evaluation function f(n) to determine the priority of a node.
   * @param isGraphSearch   Whether to use graph search (repeated states checked). Default true.
   */
  constructor(public evalFn: EvaluationFunction<S, A>, isGraphSearch = true) {
    super(isGraphSearch);
  }

  findSolution(problem: SearchProblem<S, A>): STNode<S, A> | null {
    const frontier = new Heap<STNode<S, A>>((a, b) => this.evalFn(a) - this.evalFn(b));
    let explored = Set<S>();
    const root = new STNode<S, A>(problem.initialState);

    frontier.push(root);

    while (frontier.size) {
      const node = frontier.pop()!;

      if (problem.isGoal(node.state)) {
        return node;
      }

      if (this.isGraphSearch) {
        explored = explored.add(node.state);
      }

      node.expand(problem).forEach((child) => {
        if (this.isGraphSearch && !explored.has(child.state)) {
          frontier.push(child);
        }
      });
      this.notifyNodeListeners(node);
    }

    // No solution found
    return null;
  }
}