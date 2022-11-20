import React, { useReducer } from "react";

import { Main } from "./feature/Main";
import { AppContext } from "./AppProvider";
import { initialState, reducer } from "./business/reducer";

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Main />
    </AppContext.Provider>
  );
}
