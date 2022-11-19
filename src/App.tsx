import React, { useReducer } from "react";
import "./App.less";

import { AppContext } from "./AppProvider";

import { initialState, reducer } from "./business/reducer";

import { Main } from "./Main";

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Main />
    </AppContext.Provider>
  );
}
