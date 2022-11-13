import { Set } from 'immutable';
import SearchAlgorithm from '../SearchAlgorithm';
import { SearchProblem, STNode } from '../../core';
import { Stack } from 'mnemonist';

/**
 * Depth first search (DFS) is an uninformed search algorithm
 * which explores all the nodes along a branch before backtracking
 * in the search tree first.
 *
 * Read more on <a href="https://en.wikipedia.org/wiki/Depth-first_searchh">Depth First Search</a>
 */
export class DepthFirstSearch<S, A> extends SearchAlgorithm<S, A> {
  constructor(isGraphSearch = true) {
    super(isGraphSearch);
  }

  findSolution(problem: SearchProblem<S, A>): STNode<S, A> | null {
    const frontier = Stack.of(new STNode<S, A>(problem.initialState));
    let explored = Set<S>();

    while (frontier.size) {
      const node = frontier.pop();
      if (!node) break;

      if (problem.isGoal(node.state)) {
        return node;
      }

      if (this.isGraphSearch) {
        explored = explored.add(node.state);
      }

      node.expand(problem).forEach((child) => {
        if (!this.isGraphSearch) {
          frontier.push(child);
        } else if (!explored.has(child.state)) {
          frontier.push(child);
        }
      });
      this.notifyNodeListeners(node);
    }

    // No solution found
    return null;
  }
}
