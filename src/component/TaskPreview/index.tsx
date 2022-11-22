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
  return (
    <div className="preview-container" onClick={openTask}>
      <div className="left-panel">
        <input type="checkbox" />
      </div>
      <div className="right-panel">
        <div className="preview-title">{item.value.name}</div>
        <div className="preview-description">{item.value.desc}</div>
        <div className="preview-footer">
          <div className="preview-date">{"здесь будет дата"}</div>

          <button onClick={(e) => deleteTask(e)}>delete</button>
        </div>
      </div>
    </div>
  );
};
