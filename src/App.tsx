import React, { useReducer, useRef } from "react";

import { Main } from "./feature/Main";
import { AppContext } from "./AppProvider";
import { initialState, reducer } from "./business/reducer";
import { FileItemList } from "./business/types";

/**
 *Entry point of application
 * @returns jsx root
 */

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refContainer = useRef<{ fileList: FileItemList | [] }>({
    fileList: [],
  });

  return (
    <AppContext.Provider value={{ state, dispatch, refContainer }}>
      <Main />
    </AppContext.Provider>
  );
}
