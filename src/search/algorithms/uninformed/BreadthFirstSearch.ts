import { Set } from "immutable";
import SearchAlgorithm from "../SearchAlgorithm";
import { SearchProblem, STNode } from "../../core";
import { Queue } from "mnemonist";

/**
 * Breadth first search (BFS) is an uninformed search algorithm
 * which explores the shallowest nodes in the search tree first
 * such that it goes level by level. It is optimal only if the
 * cost of each step is the same.
 *
 * Read more on <a href="https://en.wikipedia.org/wiki/Breadth-first_search">Breadth First Search</a>
 */
export class BreadthFirstSearch<S, A> extends SearchAlgorithm<S, A> {
    constructor(isGraphSearch = true) {
        super(isGraphSearch);
    }

    findSolution(problem: SearchProblem<S, A>): STNode<S, A> | null {
      const frontier = Queue.of(new STNode<S, A>(problem.initialState));
      let explored = Set<S>();

      while (frontier.size) {
        const node = frontier.dequeue()!;

        if (problem.isGoal(node.state)) {
          return node;
        }

        if (this.isGraphSearch) {
          explored = explored.add(node.state);
        }

        node.expand(problem).forEach((child) => {
          if (!this.isGraphSearch) {
            frontier.enqueue(child);
          } else if (!explored.has(child.state)) {
            frontier.enqueue(child);
          }
        });
        this.notifyNodeListeners(node);
      }

      // No solution found
      return null;
    }
}