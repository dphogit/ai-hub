import { Heap } from "mnemonist";
import { Set } from "immutable";
import { EvaluationFunction, SearchProblem } from "../core";
import { STNode } from "../core";

/**
 * Best first search based which uses a priority queue based on an evaluation function
 * to pick the next node to expand. This uses a graph search (repeated states are checked).
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