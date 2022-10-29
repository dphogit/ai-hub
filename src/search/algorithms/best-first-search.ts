import { Heap } from "mnemonist";
import { EvaluationFunction, SearchProblem } from "../core";
import { STNode } from "../core";

/**
 * Best first search based which uses a priority queue based on an evaluation function
 * to pick the next node to expand. This uses a tree search (repeated states are NOT checked)
 * hence may cause an infinite loop if the problem has cycles.
 *
 * @param problem The search problem to solve.
 * @param evalFn  The evaluation function to use to determine the priority of a node.
 */
export function bestFirstTreeSearch<S, A>(
  problem: SearchProblem<S, A>,
  evalFn: EvaluationFunction<S, A>
) {
  const frontier = new Heap<STNode<S, A>>((a, b) => evalFn(a) - evalFn(b));
  const root = new STNode<S, A>(problem.initialState);

  frontier.push(root);

  while (frontier.size) {
    const node = frontier.pop()!;

    if (problem.isGoal(node.state)) {
      return node;
    }

    node.expand(problem).forEach((child) => {
      frontier.push(child);
    });
  }
}

/**
 * Best first search based which uses a priority queue based on an evaluation function
 * to pick the next node to expand. This uses a graph search (repeated states are checked).
 *
 * @param problem The search problem to solve.
 * @param evalFn  The evaluation function to use to determine the priority of a node.
 */
export function bestFirstGraphSearch<S, A>(
  problem: SearchProblem<S, A>,
  evalFn: (state: S) => number
) {
  const frontier = new Heap<STNode<S, A>>((a, b) => evalFn(a.state) - evalFn(b.state));
  const explored = new Set<S>();
  const root = new STNode<S, A>(problem.initialState);

  frontier.push(root);

  while (frontier.size) {
    const node = frontier.pop()!;

    if (problem.isGoal(node.state)) {
      return node;
    }

    explored.add(node.state);

    node.expand(problem).forEach((child) => {
      if (!explored.has(child.state)) {
        frontier.push(child);
      }
    });
  }
}