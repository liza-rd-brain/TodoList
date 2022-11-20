import React, { useRef, useState } from "react";
import "./Task.less";
import { useAppContext } from "../AppProvider";

import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { State } from "../business/types";

const getFileList = (state: State) => {
  const fileItemList = state.currTask?.fileList;
  if (fileItemList) {
    return fileItemList.map((fileItem, index) => {
      return (
        <div key={index}>
          <a href={fileItem.link}>{fileItem.name}</a>
        </div>
      );
    });
  } else return null;
};

export const Task = () => {
  const { state, dispatch } = useAppContext();

  /**
   * В fileList можно добавить сразу несколько файлов
   * Добавление новых не перезаписывает старые
   */
  /*   const fileList = useRef<Array<any>>([]); */
  const textInput = useRef<HTMLInputElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    dispatch({ type: "changeView" });
  };

  const addFiles = () => {
    dispatch({ type: "startedAddFile", payload: fileInput.current?.files });
  };

  const addData = async () => {
    try {
      addDoc(collection(db, "todo"), {
        name: textInput.current?.value,
        desc: textArea.current?.value,
        fileList: state.currTask?.fileList,
      });
    } catch (err) {
      console.log(err);
    }

    console.log(textInput.current);
  };

  return (
    <div className="task-container" id="taskContainer">
      <div className="header-panel">
        <button onClick={closeModal}>x</button>
      </div>
      <div className="task-content">
        <div className="content-row">
          <div>заголовок</div>
          <input
            required={true}
            ref={textInput}
            type="text"
            className="task-textinput"
            defaultValue=""
          />
        </div>
        <div className="content-row">
          <div>описание</div>
          <textarea
            ref={textArea}
            className="task-textarea"
            name="post"
            id="input"
            rows={10}
            cols={40}
          ></textarea>
        </div>
        <div className="content-row">
          <div>дата завершения</div>
          <div>{"добавить дату завершения"}</div>
        </div>
        <div className="content-row">
          <div>прикрепленные файлы</div>
          <input ref={fileInput} type="file" multiple onChange={addFiles} />
          <div className="fileList">{getFileList(state)}</div>
        </div>
      </div>
      <div className="bottom-panel">
        <button
          className="control-button button-delete"
          onClick={() => console.log("delete")}
        >
          delete
        </button>
        <button className="control-button button-save" onClick={addData}>
          save
        </button>
      </div>
    </div>
  );
};
