import React from "react";
import "./App.less";
import dayjs from "dayjs";

import { useRef, useState, useEffect, RefObject } from "react";
import { db } from "./firebase";

import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { ToDoList } from "./feature/ToDoList";

export function App() {
  const initialState: { id: string; value: any }[] = [];
  const [todoList, setTodoList] = useState(initialState);

  console.log(todoList);

  const textInput: any = useRef({ value: null });

  const addData = async () => {
    try {
      await addDoc(collection(db, "todo"), {
        name: textInput.current.value,
      });
    } catch (err) {
      console.log(err);
    }
    textInput.current = null;
    console.log(textInput.current);
  };

  useEffect(() => {
    const q = query(collection(db, "todo"));
    onSnapshot(q, (querySnapshot) => {
      setTodoList(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          value: doc.data(),
        }))
      );
    });
  }, [textInput.current]);

  return (
    <div className="app-container">
      <header className="App-header">TODO</header>
      <input ref={textInput} type="text" value={undefined} />
      <button onClick={addData}> + </button>
      <ToDoList list={todoList} />
    </div>
  );
}
