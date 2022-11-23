import React from "react";
import { useContext } from "react";
import { ActionType, FileItemList, State } from "./business/types";

export const AppContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<ActionType>;
  refContainer: React.MutableRefObject<{
    fileList: FileItemList | [];
  }>;
}>(undefined as any);

export const useAppContext = () => {
  const appContext = useContext(AppContext);

  if (appContext === undefined) {
    throw new Error("Using AppContext outside of AppContext.Provider!");
  }

  return appContext;
};
