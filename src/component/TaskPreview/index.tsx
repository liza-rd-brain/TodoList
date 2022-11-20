import React, { FC } from "react";
import { useAppContext } from "../../AppProvider";
import { DataType, DataValueType } from "../../business/types";
import "./index.less";

export const TaskPreview: FC<{ item: DataType }> = ({ item }) => {
  const { state, dispatch } = useAppContext();

  const openCard = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();

    dispatch({
      type: "openedTask",
      payload: item.id,
    });
  };
  return (
    <div className="preview-container" onClick={openCard}>
      <div className="preview-title">{item.value.name}</div>
      <div className="preview-description">{item.value.desc}</div>
      <div className="preview-date">{"здесь будет дата"}</div>
      <input type="checkbox" />
      <button>delete</button>
    </div>
  );
};
