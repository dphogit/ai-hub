import { Heap } from "mnemonist";
import { Set } from "immutable";
import { EvaluationFunction, SearchProblem } from "../core";
import { STNode } from "../core";
import SearchAlgorithm from "./SearchAlgorithm";

/**
 * Best first search based which uses a priority queue based on an evaluation function
 * to pick the next node to expand. This uses a graph search (repeated states are checked).
 *
 * TODO Phase this out once class implementations are complete
 *
 * NOTE: If the heuristic function is defined as a problem class method,
 * you must bind the method to the same problem instance before passing it to this function
 *
 * <a href="https://en.wikipedia.org/wiki/Best-first_search">Best first search</a>
 *
 * @param problem         The search problem to solve.
 * @param evalFn          The evaluation function to use to determine the priority of a node.
 * @param isGraphSearch   Whether to use graph search (repeated states checked). Default true.
 *                        Setting to false will use tree search (repeated states  NOT checked).
 */
export function bestFirstSearch<S, A>(
  problem: SearchProblem<S, A>,
  evalFn: EvaluationFunction<S, A>,
  isGraphSearch = true,
) {
  const frontier = new Heap<STNode<S, A>>((a, b) => evalFn(a) - evalFn(b));
  let explored = Set<S>();
  const root = new STNode<S, A>(problem.initialState);

  frontier.push(root);

  while (frontier.size) {
    const node = frontier.pop()!;

    if (problem.isGoal(node.state)) {
      return node;
    }

    if (isGraphSearch) {
      explored = explored.add(node.state);
    }

    node.expand(problem).forEach((child) => {
      if (isGraphSearch && !explored.has(child.state)) {
        frontier.push(child);
      }
    });
  }
}

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
        this.notifyNodeListeners('found', node);
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
      this.notifyNodeListeners('expand', node);
    }

    // No solution found
    this.notifyNodeListeners('fail');
    return null;
  }
}