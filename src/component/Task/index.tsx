import dayjs from "dayjs";
import React, {
  BaseSyntheticEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { Preloader } from "../Preloader";
import { useAppContext } from "../../AppProvider";
import { DataType, DataValueType, FileItemList } from "../../business/types";
import { checkIsExpired } from "../../business/helpers/checkIsExpired";

import "./index.less";
import { useLoadFile } from "../../business/effect/useLoadFile";

const MARK_TEXT = "просрочена";
const NAME_TASK_TEXT = "заголовок";
const DESC_TASK_TEXT = "описание";
const DATE_TASK_TEXT = "дата завершения";
const FILE_TASK_TEXT = "прикрепленные файлы";

const ADD_FILE_TASK = "выберите файл";
const TASK_DONE_TEXT = "завершить задачу";

const DELETE_BUTTON_TEXT = "удалить";
const SAVE_BUTTON_TEXT = "сохранить";

const minData = dayjs().format("YYYY-MM-DD");

export const Task = () => {
  const { state, dispatch } = useAppContext();

  const currRefContainer = useRef<{ fileList: FileItemList | [] }>({
    fileList: [],
  });

  const currTask = state.data?.find((item) => {
    return item.id === state.currTaskId;
  });

  /**
   * - if item already has file (we editing card), then paint them,
   * - if we create new task, check ref store for file
   */
  const currFileList = currRefContainer.current.fileList.length
    ? currRefContainer.current.fileList
    : currTask?.value?.fileList;

  /**
   * function that paint loaded file list
   */
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

  const saveDate = (
    e: React.FormEvent<HTMLInputElement> & BaseSyntheticEvent
  ) => {
    setDataState((prev) => {
      return { ...prev, [e.target.type]: e.target.value };
    });
  };

  /**
   * emit dispatch that close task card
   */
  const closeModal = () => {
    //clean up ref store when portal closed
    currRefContainer.current.fileList = [];
    dispatch({ type: "changeView" });
  };

  /**
   * emit dispatch that started add file
   */
  const addFiles = () => {
    dispatch({
      type: "startedAddFile",
      payload: fileInput.current?.files as FileList,
    });
  };

  /**
   * emit dispatch that started save task
   */
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

    const payloadWithFile = {
      fileList: currFileList?.length ? currFileList : [],
    };

    //clean up ref store when portal closed
    currRefContainer.current.fileList = [];

    const newPayload = Object.assign(payloadCore, payloadWithFile);

    if (state.phase.type === "cardCreating") {
      dispatch({
        type: "startedSaveTask",
        payload: newPayload,
      });
    } else if (state.phase.type === "cardEditing") {
      /**
       * id edit card already have id!
       */
      const currTaskId = state.currTaskId as string;
      dispatch({
        type: "startedEditTask",
        payload: { taskItem: newPayload, id: currTaskId },
      });
    }
  };

  /**
   * emit dispatch that started delete task from list
   */
  const deleteTask = () => {
    currRefContainer.current.fileList = [];
    dispatch({
      type: "startedDeleteTask",
      payload: state?.currTaskId,
    });
  };

  /**
   * emit dispatch that edit done task
   * work only on card editing
   */
  const changeTaskDone = (e: React.FormEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (currTask) {
      const doneTask: DataValueType = {
        ...currTask.value,
        isDone: !currTask.value.isDone,
      };

      const currTaskId = currTask?.id as string;

      dispatch({
        type: "startedChangeDone",
        payload: { taskItem: doneTask, id: currTaskId },
      });
    }
  };

  const dataExpired = dateState.date
    ? checkIsExpired(dateState as { date: string; time?: string })
    : currTask?.isExpired;

  /**
   * task cant be expired if it done
   */
  const taskExpired = dataExpired && !currTask?.value.isDone;

  useLoadFile(currRefContainer);

  useEffect(() => {
    return () => {
      console.log("clear currRefContainer ");
      currRefContainer.current.fileList = [];
    };
  }, []);

  return (
    <div className="task-container" id="taskContainer">
      <div className="header-panel">
        <div>
          {state.phase.type === "cardEditing" && (
            <>
              <input
                type="checkbox"
                checked={currTask?.value?.isDone}
                onChange={changeTaskDone}
              />
              <span>{TASK_DONE_TEXT}</span>
            </>
          )}
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
              defaultValue={currTask?.value?.name}
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
              defaultValue={currTask?.value?.desc}
            ></textarea>
          </div>
          <div className="content-row">
            <div className="task-caption">
              {DATE_TASK_TEXT}
              {taskExpired && <span className="date-mark">{MARK_TEXT}</span>}
            </div>

            <div className="data-wrapper">
              {/* TODO: можно добавить минимальную дату и время */}
              <input
                type="date"
                defaultValue={currTask?.value?.endDate?.date}
                required={Boolean(dateState.time)}
                min={minData}
                onChange={saveDate}
              />
              <input
                type="time"
                defaultValue={currTask?.value?.endDate?.time || undefined}
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
                    ADD_FILE_TASK
                  )}
                </span>
              </label>
            </div>

            <div className="fileList">{getFileList()}</div>
          </div>
        </div>
        <div className="bottom-panel">
          <button className="control-button button-delete" onClick={deleteTask}>
            {DELETE_BUTTON_TEXT}
          </button>
          <button type="submit" className="control-button button-save">
            {SAVE_BUTTON_TEXT}
          </button>
        </div>
      </form>
    </div>
  );
};
