import React, { FC } from "react";

import { DataTypeList } from "../../business/types";
import { TaskPreview } from "../../component/TaskPreview";

import "./index.less";

/**
 *
 * @param param0 can accept list or null
 * @returns list of TaskPreview
 */
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
