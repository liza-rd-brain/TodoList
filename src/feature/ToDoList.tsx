import React, { FC } from "react";
import { DocumentData } from "firebase/firestore";

const ToDoItem = ({ item }) => {
  return <div>{item}</div>;
};

export const ToDoList = ({ list }) => {
  console.log(list);

  return (
    <div>
      {list.map((item, index) => {
        console.log(item.value, index);
        return <ToDoItem key={index} item={item.value.name} />;
      })}
    </div>
  );
};
