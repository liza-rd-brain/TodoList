import React, { FC } from "react";

import { DataTypeList } from "../../business/types";
import { TaskPreview } from "../../component/TaskPreview";

import "./index.less";

export const TaskList: FC<{ list: DataTypeList | null }> = ({ list }) => {
  if (list) {
    return (
      <div className="task-list-container">
        {list.map((item, index) => {
          return <TaskPreview key={index} item={item} />;
        })}
      </div>
    );
  } else return null;
};
