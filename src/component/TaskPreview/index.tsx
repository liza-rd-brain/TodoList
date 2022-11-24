import React, { FC } from "react";

import { useAppContext } from "../../AppProvider";
import { DataType, DataValueType } from "../../business/types";

import "./index.less";

const DELETE_BTN_TEXT = "удалить";
const EXPIRED_TEXT = "просрочена";

export const TaskPreview: FC<{ item: DataType }> = ({ item }) => {
  const { dispatch } = useAppContext();

  /**
   * emit dispatch that started delete task from list
   */
  const deleteTask = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    dispatch({
      type: "startedDeleteTask",
      payload: item.id,
    });
  };

  /**
   * emit dispatch that open task card
   */
  const openTask = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();

    dispatch({
      type: "openedTask",
      payload: item.id,
    });
  };

  /**
   * emit dispatch that edit done task
   */
  const changeTaskDone = (e) => {
    e.stopPropagation();
    const doneTask: DataValueType = {
      ...item.value,
      isDone: !item.value.isDone,
    };

    dispatch({
      type: "startedChangeDone",
      payload: { taskItem: doneTask, id: item.id },
    });
  };

  /**
   * task cant be expired if it done
   */
  const taskExpired = item.isExpired && !item.value.isDone;

  return (
    <div className="preview-container" onClick={openTask}>
      <div className="left-panel">
        <input
          type="checkbox"
          checked={item.value.isDone}
          onChange={changeTaskDone}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="right-panel">
        <div>
          <div className="preview-title">{item.value.name}</div>
          <div className="preview-description">{item.value.desc}</div>
        </div>
        <div className="preview-footer">
          <div className="preview-date">
            {item.value.endDate && (
              <>
                <span>{item.value.endDate.date}</span>
                <span>{item.value.endDate.time}</span>
              </>
            )}
            {taskExpired && <span className="date-mark">{EXPIRED_TEXT}</span>}
          </div>

          <button onClick={(e) => deleteTask(e)}>{DELETE_BTN_TEXT}</button>
        </div>
      </div>
    </div>
  );
};
