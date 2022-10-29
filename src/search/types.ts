import { STNode } from "./core/STNode";

export type EvaluationFunction<S, A> = (n: STNode<S, A>) => number;
export type HeuristicFunction<S, A> = (s: STNode<S, A>) => number;
