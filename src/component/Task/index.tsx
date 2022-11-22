import React, { FormEvent, FormEventHandler, useRef, useState } from "react";

import { Preloader } from "../Preloader";
import { useAppContext } from "../../AppProvider";
import { FileItemList, State } from "../../business/types";

import "./index.less";
import dayjs from "dayjs";

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

  const dateInput = useRef<HTMLInputElement>(null);
  const timeInput = useRef<HTMLInputElement>(null);

  const hasTimeInput = Boolean(
    timeInput.current?.value || state.currTask?.value?.endDate?.time
  );

  const [needData, setNeedData] = useState(hasTimeInput);

  console.log("needData", needData);

  /* Если ввели время - дата обязательна! */
  const switchNeedData = () => {
    setNeedData(hasTimeInput);
  };

  const defaultData = dayjs().add(1, "day").format("YYYY-MM-DD");
  const minData = dayjs().format("YYYY-MM-DD");
  const defaultTime = dayjs().format("HH:mm");

  console.log(Boolean(timeInput.current?.value));

  const closeModal = () => {
    dispatch({ type: "changeView" });
  };

  const addFiles = () => {
    dispatch({ type: "startedAddFile", payload: fileInput.current?.files });
  };

  const getPayloadCore = ({ name, desc, endDate }) => {};

  const saveTask = (e: FormEvent) => {
    e.preventDefault();
    //TODO: выбирать, какие данные отправлять, убрать пустую строку

    const payloadCore = {
      name: textInput.current?.value as string,
      desc: textArea.current?.value as string,
      endDate: {
        date: dateInput.current?.value as string,
        time: timeInput.current?.value as string,
      },
    };

    // const payloadCore = getPayloadCore({
    //   name: textInput.current?.value,
    //   desc: textArea.current?.value,
    //   endDate: {
    //     date: dateInput.current?.value as string,
    //     time: timeInput.current?.value as string,
    //   },
    // });

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

            <div className="data-wrapper">
              {/* TODO: можно добавить минимальную дату и время */}
              <input
                type="date"
                ref={dateInput}
                defaultValue={state.currTask?.value?.endDate?.date}
                required={needData}
                min={minData}
              />
              <input
                type="time"
                ref={timeInput}
                defaultValue={state.currTask?.value?.endDate?.time}
                onChange={switchNeedData}
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
