import React, { useReducer } from "react";

import { useAppContext } from "../AppProvider";

import { useRef } from "react";
import { createPortal } from "react-dom";

import { ToDoList } from "./ToDoList";
import { initialState, reducer } from "../business/reducer";
import { Preloader } from "../component/Preloader";
import { Task } from "../component/Task";
import { useFireBase } from "../business/effect";

const BUTTON_TEXT = "Add Task";

export function Main() {
  const { state, dispatch } = useAppContext();

  console.log("state", state);

  const getView = () => {
    switch (state.view) {
      case "loading": {
        return <Preloader />;
      }
      case "list": {
        return (
          <div className="todo-list" id="listTask">
            <div className="app-logo">TODO</div>
            <button className="app-create-task" onClick={(e) => createTask(e)}>
              {BUTTON_TEXT}
            </button>
            <ToDoList list={state.data} />
          </div>
        );
      }
      case "card": {
        const parentForCard = document.getElementById(
          "listTask"
        ) as HTMLElement;
        const cardPortal = createPortal(<Task />, parentForCard);

        return (
          <div className="todo-list" id="listTask">
            <div className="app-logo">TODO</div>
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

  const createTask = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    console.log("открыть модалку");
    dispatch({ type: "changeView" });
  };

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

  useFireBase();

  return (
    <div
      className={
        state.view == "card"
          ? "app-container app-container-blur"
          : " app-container "
      }
    >
      {getView()}
    </div>
  );
}
