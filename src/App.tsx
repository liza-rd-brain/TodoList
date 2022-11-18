import React, { useReducer } from "react";
import "./App.less";
import dayjs from "dayjs";

import { AppContext } from "./AppProvider";

import { useRef, useState, useEffect, useLayoutEffect, RefObject } from "react";
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
import { createPortal } from "react-dom";
import { Task } from "./component/Task";

const BUTTON_TEXT = "Add Task";

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
          <div className="todo-list" id="test">
            <div className="app-logo">TODO</div>
            {/*     <input ref={textInput} type="text" defaultValue="" /> */}
            <button className="app-create-task" onClick={(e) => createTask(e)}>
              {BUTTON_TEXT}
            </button>
            <ToDoList list={state.data} />
          </div>
        );
      }
      case "card": {
        const parentForCard = document.getElementById("test") as HTMLElement;
        const cardPortal = createPortal(<Task />, parentForCard);
        /*      return cardPortal;
         */
        return (
          <div className="todo-list">
            <div className="app-logo">TODO</div>
            {/*     <input ref={textInput} type="text" defaultValue="" /> */}
            <button className="app-create-task" onClick={(e) => createTask(e)}>
              {BUTTON_TEXT}
            </button>
            {cardPortal}
            <ToDoList list={state.data} />
          </div>
        );
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

    console.log(textInput.current);
  };

  const createTask = (e: any) => {
    e.stopPropagation();
    console.log("открыть модалку");
    dispatch({ type: "changeView" });
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

  /* Закрыть модалку */
  // const closeModal = (e: MouseEvent) => {
  //   console.log("закрыть модалку");
  //   const container = document.getElementById("taskContainer");
  //   console.log("container", container, e?.target);
  //   if (e?.target !== container && state.view === "card") {
  //     dispatch({ type: "changeView" });
  //   }
  // };

  // document.addEventListener("click", closeModal);

  // useEffect(() => {
  //   if (state.view === "card") {
  //     console.log("подписка");
  //     document.addEventListener("click", closeModal);
  //     /*     return document.removeEventListener("click", closeModal); */
  //   }
  // }, [state.view]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div
        className={
          state.view == "card"
            ? "app-container app-container-blur"
            : " app-container "
        }
      >
        {getView()}
      </div>

      {/*        */}
    </AppContext.Provider>
  );
}
