import React, { FC } from "react";
import { useAppContext } from "../../AppProvider";
import { DataType, DataValueType } from "../../business/types";
import "./index.less";

export const TaskPreview: FC<{ item: DataType }> = ({ item }) => {
  const { state, dispatch } = useAppContext();

  const deleteTask = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    dispatch({
      type: "startedDeleteTask",
      payload: item.id,
    });
  };

  const openTask = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();

    dispatch({
      type: "openedTask",
      payload: item.id,
    });
  };

  const makeTaskDone = (e) => {
    e.stopPropagation();
    const doneTask: DataValueType = {
      ...item.value,
      isDone: !item.value.isDone,
    };

    console.log("startedChangeDone", doneTask);

    dispatch({
      type: "startedChangeDone",
      payload: { taskItem: doneTask, id: item.id },
    });
  };

  return (
    <div className="preview-container" onClick={openTask}>
      <div className="left-panel">
        <input
          type="checkbox"
          checked={item.value.isDone}
          onChange={makeTaskDone}
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
            {item.isExpired && <span className="date-mark">просрочена</span>}
          </div>

          <button onClick={(e) => deleteTask(e)}>delete</button>
        </div>
      </div>
    </div>
  );
};
