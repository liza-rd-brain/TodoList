import { useEffect } from "react";
import { useAppContext } from "../AppProvider";

import {
  collection,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

export function useFireBase() {
  const {
    state: { doEffect },
    dispatch,
  } = useAppContext();

  useEffect(() => {
    if (doEffect.type === "!loadFireBase") {
      const q = query(collection(db, "todo"));
      onSnapshot(q, (querySnapshot) => {
        const todoList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          value: doc.data(),
        }));

        dispatch({ type: "loadedTaskList", payload: todoList });
      });
    }
  }, [doEffect]);
}
