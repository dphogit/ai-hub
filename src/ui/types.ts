import { Puzzle, PuzzleAction, STNode } from "../search";

export interface DisplayStepsOptions {
  path: STNode<Puzzle, PuzzleAction>[];
  onComplete?: () => void;
  interval?: number;
}
