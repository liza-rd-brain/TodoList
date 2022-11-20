import React, { FC } from "react";

const ToDoItem = ({ item }) => {
  return <div>{item}</div>;
};

export const TaskList = ({ list }) => {
  return (
    <div>
      {list.map((item, index) => {
        return <ToDoItem key={index} item={item.value.name} />;
      })}
    </div>
  );
};
