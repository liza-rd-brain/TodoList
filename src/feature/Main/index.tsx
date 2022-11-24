import React from "react";
import { createPortal } from "react-dom";

import { TaskList } from "../TaskList";
import { Task } from "../../component/Task";
import { useAppContext } from "../../AppProvider";
import { Preloader } from "../../component/Preloader";
import {
  useCheckExpired,
  useClosePortal,
  useFireBase,
} from "../../business/effect";

import "./index.less";

const BUTTON_TEXT = "Добавить задачу";
const LOGO_TEXT = "TODO";

/**
 * Main - kinda page/features
 * represent all application view
 * @returns application page
 */
export function Main() {
  const { state, dispatch } = useAppContext();

  /**
   *
   * @param childNode  - optional portal element, create modal like window
   * @returns container with task list
   */
  const getTaskList = (childNode?: React.ReactPortal) => {
    return (
      <div className="todo-list" id="listTask">
        {childNode ? childNode : null}
        <div className="todo-header">
          <div className="app-logo">{LOGO_TEXT}</div>
          <button className="app-button" onClick={(e) => createTask(e)}>
            {BUTTON_TEXT}
          </button>
        </div>
        <div className="task-list-container">
          <TaskList list={state.data} />
        </div>
      </div>
    );
  };

  /**
   * Function for view determination, can be:
   * - preloader
   * - list
   * - list with portal
   * @returns view depends on `state.view`
   */
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

  /**
   * Emit action `create task`, open modal window
   * @param e - click event
   */
  const createTask = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    dispatch({ type: "changeView" });
  };

  useFireBase();
  useClosePortal();
  useCheckExpired();

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
