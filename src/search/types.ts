import { List } from "immutable";
import { STNode } from "./core";

export type EvaluationFunction<S, A> = (n: STNode<S, A>) => number;
export type HeuristicFunction<S> = (s: S) => number;

export type Puzzle = List<number>;
export type PuzzleAction = "U" | "L" | "R" | "D";
