import { SearchProblem } from "./SearchProblem";

/**
 * Represents a node in the search tree. A node consists of:
 *
 * - state: The state of the node
 * - parent: The parent node of the node.
 * - action: The action that was applied to the parent node to get to this node.
 * - pathCost: The cost of the path from the root node to this node.
 *
 * The type generics of S and A represent the state and action types respectively.
 * An action is what is used to transition from one state to another.
 */
export class STNode<S, A> {
  depth: number;

  constructor(
    public readonly state: S,
    public readonly parent: STNode<S, A> | undefined = undefined,
    public readonly action: A | undefined = undefined,
    public readonly pathCost: number = 0,
  ) {
    this.depth = parent ? parent.depth + 1 : 0;
  }

  private generateChild(problem: SearchProblem<S, A>, action: A): STNode<S, A> {
    const nextState = problem.getActionResult(this.state, action);
    const nextCost = this.pathCost + problem.getActionCost(this.state, action, nextState);
    return new STNode<S, A>(nextState, this, action, nextCost);
  }

  // Creates children nodes from this node using the problem's successor function.
  expand(problem: SearchProblem<S, A>): STNode<S, A>[] {
    const children: STNode<S, A>[] = [];
    problem.getActions(this.state).forEach((action: A) => {
      children.push(this.generateChild(problem, action));
    })
    return children;
  }

  // Returns the sequence of actions to get from the root node to this node.
  actionSequence(): A[] {
    return this.path().reduce((acc, node) => {
      node.action && acc.push(node.action);
      return acc;
    }, [] as A[]);
  }

  // Returns the path from the root node to this node.
  path(): STNode<S, A>[] {
    const path: STNode<S, A>[] = [];
    let node: STNode<S, A> | undefined = this;
    while (node) {
      path.push(node);
      node = node.parent;
    }
    return path.reverse();
  }
}