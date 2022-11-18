import React, { useRef } from "react";
import "./Task.less";
import { useAppContext } from "../AppProvider";

export const Task = () => {
  const { state, dispatch } = useAppContext();
  const textInput: any = useRef({ value: null });

  const closeModal = () => {
    dispatch({ type: "changeView" });
  };

  return (
    <div className="task-container" id="taskContainer">
      <div className="header-panel">
        <button onClick={closeModal}>x</button>
      </div>
      <div className="task-content">
        <div className="content-row">
          <div>заголовок</div>
          <input ref={textInput} type="text" defaultValue="" />
        </div>
        <div className="content-row">
          <div>описание</div>
          <textarea name="post" id="input"></textarea>
        </div>
        <div className="content-row">
          <div>дата завершения</div>
          <div>{"добавить дату завершения"}</div>
        </div>
        <div className="content-row">
          <div>прикрепленные файлы</div>
          <input type="file" multiple />
        </div>
      </div>
    </div>
  );
};
