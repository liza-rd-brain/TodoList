import React, { useRef } from "react";

import { Preloader } from "../Preloader";
import { useAppContext } from "../../AppProvider";
import { FileItemList, State } from "../../business/types";

import "./index.less";

const NAME_TASK_TEXT = "заголовок";
const DESC_TASK_TEXT = "описание";
const DATE_TASK_TEXT = "дата завершения";
const FILE_TASK_TEXT = "прикрепленные файлы";

const getFileList = (state: State) => {
  const fileItemList = state.currTask?.value?.fileList;
  if (fileItemList) {
    return fileItemList.map((fileItem, index) => {
      return (
        <div key={index}>
          <a href={fileItem?.link} target="blank">
            {fileItem?.name}
          </a>
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

  const saveTask = (e: SubmitEvent) => {
    e.preventDefault();
    const payloadCore = {
      name: textInput.current?.value as string,
      desc: textArea.current?.value as string,
    };

    const payloadWithFile = {
      fileList: state.currTask?.value?.fileList as FileItemList,
    };

    const newPayload = state.currTask?.value?.fileList
      ? Object.assign(payloadCore, payloadWithFile)
      : payloadCore;

    dispatch({
      type: "startedSaveTask",
      payload: newPayload,
    });
  };

  const deleteTask = () => {
    dispatch({
      type: "startedDeleteTask",
      payload: state.currTask?.id as string,
    });
  };

  const preventSubmit = (e) => {
    e.preventDefault();
    console.log("preventSubmit");
  };

  return (
    <div className="task-container" id="taskContainer">
      <div className="header-panel">
        <button onClick={closeModal}>x</button>
      </div>
      <form onSubmit={saveTask}>
        <div className="task-content">
          <div className="content-row">
            <div className="task-caption">{NAME_TASK_TEXT}</div>

            <input
              required={true}
              ref={textInput}
              type="text"
              className="task-textinput"
              defaultValue={state.currTask?.value?.name}
            />
          </div>
          <div className="content-row">
            <div className="task-caption">{DESC_TASK_TEXT}</div>
            <textarea
              ref={textArea}
              className="task-textarea"
              name="post"
              id="input"
              rows={10}
              cols={40}
              defaultValue={state.currTask?.value?.desc}
            ></textarea>
          </div>
          <div className="content-row">
            <div className="task-caption">{DATE_TASK_TEXT}</div>
            <div>{"добавить дату завершения"}</div>
          </div>

          <div className="content-row">
            <div className="caption-wrap">
              <div className="task-caption">{FILE_TASK_TEXT}</div>
              <label className="input-file">
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  onChange={addFiles}
                  className="input-file"
                />
                <span>
                  {state.phase.type === "fileAdding" ? (
                    <Preloader type="small" />
                  ) : (
                    "выберите файл"
                  )}
                </span>
              </label>
            </div>

            <div className="fileList">{getFileList(state)}</div>
          </div>
        </div>
        <div className="bottom-panel">
          <button className="control-button button-delete" onClick={deleteTask}>
            delete
          </button>
          <button type="submit" className="control-button button-save">
            save
          </button>
        </div>
      </form>
    </div>
  );
};
