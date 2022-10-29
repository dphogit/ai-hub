interface SearchProblemConfig<S> {
  initialState: S;
  goalState?: S;
}

/**
 * Follows a formal definition of a problem to be solved via search algorithms.
 * Is a basis for all types of search problems which need to be overridden with
 * specific contextual details regarding the  domain. State and actions are defined
 * through the generic parameters of S and A respectively.
 *
 * Specify a goalState if there is a specific goal state to be checked.
 */
export abstract class SearchProblem<S, A> {
  public initialState: S;
  public goalState: S | undefined;

  protected constructor(config: SearchProblemConfig<S>) {
    this.initialState = config.initialState;
    this.goalState = config.goalState;
  }

  /**
   * Returns the possible actions that can be executed in the given state.
   * @param state The state to get the actions for.
   */
  abstract getActions(state: S): Set<A>;

  /**
   * Returns the state that results from executing the given action in the given state.
   * @param state The state to execute the action in.
   * @param action The action to execute.
   */
  abstract getActionResult(state: S, action: A): S;

  /**
   * Get the cost of applying an action from state1 to state2.
   * @param state1 The state to apply the action in.
   * @param action The action applied.
   * @param state2 The resulting state after applying the action.
   */
  abstract getActionCost(state1: S, action: A, state2: S): number;

  /**
   * Checks if the given state is a goal state.
   * @param state
   */
  abstract isGoal(state: S): boolean;
}
