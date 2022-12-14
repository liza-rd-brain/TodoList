import React from "react";
import { useContext } from "react";
import { ActionType, FileItemList, State } from "./business/types";

/**
 * create context for application
 */
export const AppContext = React.createContext<{
  /**
   * entire application state
   */
  state: State;
  /**
   *dispatcher for actions
   */
  dispatch: React.Dispatch<ActionType>;
}>(undefined as any);

/**
 *
 * @returns application context
 *
 * - state- all app state
 * - dispatch - dispatcher for actions

 */
export const useAppContext = () => {
  const appContext = useContext(AppContext);

  if (appContext === undefined) {
    throw new Error("Using AppContext outside of AppContext.Provider!");
  }

  return appContext;
};
