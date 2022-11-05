import { STNode, SearchProblem, NodeListener } from "../core";

export default abstract class SearchAlgorithm<S, A> {
  nodeListeners: NodeListener<S, A>[] = [];

  protected constructor(public isGraphSearch = true) {}

  abstract findSolution(problem: SearchProblem<S, A>): STNode<S, A> | null;

  addNodeListener(listener: NodeListener<S, A>) {
    this.nodeListeners.push(listener);
  }

  removeNodeListener(listener: NodeListener<S, A>) {
    this.nodeListeners = this.nodeListeners.filter(l => l !== listener);
  }

  protected notifyNodeListeners(node: STNode<S, A>) {
    this.nodeListeners.forEach(listener => listener.update(node));
  }
}
