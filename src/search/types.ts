import { List } from "immutable";
import { STNode } from "./core";

export type EvaluationFunction<S, A> = (n: STNode<S, A>) => number;
export type HeuristicFunction<S> = (s: S) => number;

export interface SearchProblemConfig<S> {
  initialState: S;
  goalState?: S;
}

export type Puzzle = List<number>;
export type PuzzleAction = "U" | "L" | "R" | "D";

export interface Listener<T> {
  update: (data: T) => void;
}

export type NodeListener<S, A> = Listener<STNode<S, A>>;
