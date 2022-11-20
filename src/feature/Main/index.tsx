import React from "react";
import { createPortal } from "react-dom";

import { TaskList } from "../TaskList";
import { Task } from "../../component/Task";
import { useAppContext } from "../../AppProvider";
import { Preloader } from "../../component/Preloader";
import { useClosePortal, useFireBase } from "../../business/effect";

import "./index.less";

const BUTTON_TEXT = "Add Task";

export function Main() {
  const { state, dispatch } = useAppContext();

  const getTaskList = (childNode?: React.ReactPortal) => {
    return (
      <div className="todo-list" id="listTask">
        {childNode ? childNode : null}
        <div className="app-logo">TODO</div>
        <button className="app-create-task" onClick={(e) => createTask(e)}>
          {BUTTON_TEXT}
        </button>
        <TaskList list={state.data} />
      </div>
    );
  };

  const getView = () => {
    switch (state.view) {
      case "loading": {
        return <Preloader type="big" />;
      }

      case "list": {
        return getTaskList();
      }

      case "card": {
        const parentForCard = document.getElementById(
          "listTask"
        ) as HTMLElement;
        const cardPortal = createPortal(<Task />, parentForCard);

        return getTaskList(cardPortal);
      }
    }
  };

  const createTask = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    dispatch({ type: "changeView" });
  };

  useFireBase();
  useClosePortal();

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
