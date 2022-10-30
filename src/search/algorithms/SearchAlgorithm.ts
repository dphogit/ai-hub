import { STNode } from "../core";
import { SearchProblem } from "../core";

interface Observer<E extends string, T> {
  update: (event: E, data?: T) => void;
}

type SearchAlgorithmEvent = "expand" | "found" | "fail";
type NodeListener<S, A> = Observer<SearchAlgorithmEvent, STNode<S, A>>;

export default abstract class SearchAlgorithm<S, A> {
  nodeListeners: NodeListener<S, A>[] = [];

  abstract findSolution(problem: SearchProblem<S, A>): STNode<S, A> | null;

  addObserver(observer: NodeListener<S, A>) {
    this.nodeListeners.push(observer);
  }

  removeObserver(observer: NodeListener<S, A>) {
    this.nodeListeners = this.nodeListeners.filter(o => o !== observer);
  }
}
