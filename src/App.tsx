import React, { useReducer } from "react";
import "./App.less";
import dayjs from "dayjs";

import { AppContext } from "./App.provider";

import { useRef, useState, useEffect, RefObject } from "react";
import { db } from "./firebase";

import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { ToDoList } from "./feature/ToDoList";
import { initialState, reducer } from "./business/reducer";
import { Preloader } from "./component/Preloader";

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const textInput: any = useRef({ value: null });

  const getView = () => {
    switch (state.view) {
      case "loading": {
        return <Preloader />;
      }
      case "list": {
        return (
          <div className="todo-list">
            <header className="App-header">TODO</header>
            <input ref={textInput} type="text" defaultValue="" />
            <button onClick={addData}> + </button>
            <ToDoList list={state.data} />
          </div>
        );
      }
      case "card": {
        return null;
      }
    }
  };
  const addData = async () => {
    try {
      await addDoc(collection(db, "todo"), {
        name: textInput.current.value,
      });
    } catch (err) {
      console.log(err);
    }

    textInput.current = null;
    console.log(textInput.current);
  };

  useEffect(() => {
    const q = query(collection(db, "todo"));
    onSnapshot(q, (querySnapshot) => {
      const todoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        value: doc.data(),
      }));

      dispatch({ type: "loadTaskList", payload: todoList });
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="app-container">{getView()}</div>

      {/*        */}
    </AppContext.Provider>
  );
}
