import { STNode } from "../core";
import { SearchProblem } from "../core";

interface Observer<E extends string, T> {
  update: (event: E, data?: T) => void;
}

type SearchAlgorithmEvent = "expand" | "found" | "fail";
type NodeListener<S, A> = Observer<SearchAlgorithmEvent, STNode<S, A>>;

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

  protected notifyNodeListeners(event: SearchAlgorithmEvent, data?: STNode<S, A>) {
    this.nodeListeners.forEach(listener => listener.update(event, data));
  }
}
