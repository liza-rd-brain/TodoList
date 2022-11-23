import React, { useReducer, useRef } from "react";

import { Main } from "./feature/Main";
import { AppContext } from "./AppProvider";
import { initialState, reducer } from "./business/reducer";

import "./App.less";

/**
 *Entry point of application
 * @returns jsx root
 */

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Main />
    </AppContext.Provider>
  );
}
