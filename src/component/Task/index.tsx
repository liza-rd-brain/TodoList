import React, { FormEvent, useRef, useState } from "react";

import { Preloader } from "../Preloader";
import { useAppContext } from "../../AppProvider";
import { DataValueType, FileItemList, State } from "../../business/types";

import "./index.less";
import dayjs from "dayjs";
import { checkIsExpired } from "../../business/helpers/checkIsExpired";

const NAME_TASK_TEXT = "заголовок";
const DESC_TASK_TEXT = "описание";
const DATE_TASK_TEXT = "дата завершения";
const FILE_TASK_TEXT = "прикрепленные файлы";
const MARK_TEXT = "просрочена";

export const Task = () => {
  const { state, dispatch, refContainer } = useAppContext();

  const currFileList = refContainer.current.fileList.length
    ? refContainer.current.fileList
    : state.currTask?.value.fileList;

  console.log("currFileList", currFileList);
  console.log("refContainer", refContainer.current.fileList);

  const getFileList = () => {
    if (currFileList) {
      return currFileList.map((fileItem, index) => {
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

  const textInput = useRef<HTMLInputElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  console.log("что лежит в файлах", fileInput.current);

  const minData = dayjs().format("YYYY-MM-DD");

  type DateStateType = {
    date: string | null;
    time: string | null;
  };

  const initState: DateStateType = {
    date: null,
    time: null,
  };

  const [dateState, setDataState] = useState(() => {
    return initState;
  });

  const saveDate = (e) => {
    setDataState((prev) => {
      return { ...prev, [e.target.type]: e.target.value };
    });
  };

  //TODO: очищаем реф
  const closeModal = () => {
    //очищаем хранилище
    refContainer.current.fileList = [];
    dispatch({ type: "changeView" });
  };

  //добавляем в реф
  const addFiles = () => {
    console.log("перед добавкой", refContainer.current.fileList);
    console.log("добавили мы", fileInput.current?.files);

    dispatch({
      type: "startedAddFile",
      payload: fileInput.current?.files as FileList,
    });
  };

  const dataExpired = dateState.date
    ? checkIsExpired(dateState as { date: string; time?: string })
    : state.currTask?.isExpired;

  // console.log("dataExpired", dataExpired);

  const saveTask = (e: FormEvent) => {
    e.preventDefault();

    const payloadCore = {
      name: textInput.current?.value as string,
      desc: textArea.current?.value as string,
      isDone: false,
      endDate: {
        date: dateState.date || "",
        time: dateState.time || "",
      },
    };

    console.log("payloadCore", payloadCore);

    //копируем чтобы не потерять значения из контейнера
    const payloadWithFile = {
      fileList: currFileList?.length ? currFileList : [],
    };

    console.log("payloadWithFile", currFileList);

    // очищаем хранилище
    refContainer.current.fileList = [];

    console.log("payloadWithFile", payloadWithFile);

    const newPayload = Object.assign(payloadCore, payloadWithFile);

    console.log("newPayload", newPayload);

    dispatch({
      type: "startedSaveTask",
      payload: newPayload,
    });
  };

  const deleteTask = () => {
    refContainer.current.fileList = [];
    dispatch({
      type: "startedDeleteTask",
      payload: state.currTask?.id as string,
    });
  };

  const makeTaskDone = () => {
    const doneTask: DataValueType = {
      ...(state.currTask?.value as DataValueType),
      isDone: true,
    };
    dispatch({
      type: "startedSaveTask",
      payload: doneTask,
    });
  };

  return (
    <div className="task-container" id="taskContainer">
      <div className="header-panel">
        <div>
          <input type="checkbox" onClick={makeTaskDone} />
          <span>завершить задачу</span>
        </div>

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
            <div className="task-caption">
              {DATE_TASK_TEXT}
              {dataExpired && <span className="date-mark">{MARK_TEXT}</span>}
            </div>

            <div className="data-wrapper">
              {/* TODO: можно добавить минимальную дату и время */}
              <input
                type="date"
                defaultValue={state.currTask?.value?.endDate?.date}
                required={Boolean(dateState.time)}
                min={minData}
                onChange={saveDate}
              />
              <input
                type="time"
                defaultValue={state.currTask?.value?.endDate?.time || undefined}
                onChange={saveDate}
              ></input>
            </div>
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
                  {state.doEffect?.type === "!loadFile" ? (
                    <Preloader type="small" />
                  ) : (
                    "выберите файл"
                  )}
                </span>
              </label>
            </div>

            <div className="fileList">{getFileList()}</div>
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
