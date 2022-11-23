import { useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";

import { addExpire } from "../helpers";
import { db, path } from "../../firebase";
import { useAppContext } from "../../AppProvider";
import { LoadedDataType } from "../types";

/**
 * hook for interaction with firebase
 */
export function useFireBase() {
  const {
    state: { doEffect },
    dispatch,
  } = useAppContext();

  useEffect(() => {
    switch (doEffect?.type) {
      // automatically pull data when bd update
      case "!loadFireBase": {
        const currQuery = query(collection(db, path), orderBy("creationDate"));

        const unsubscribe = onSnapshot(currQuery, (querySnapshot) => {
          const todoList = querySnapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                value: doc.data(),
              } as LoadedDataType)
          );

          const listWithMark = addExpire(todoList);

          dispatch({ type: "loadedTaskList", payload: listWithMark });
        });
        break;

        /* Нужна ли отписка и контроль за обновлением-?! */
        // return () => {
        //   console.log("отписка");
        //   unsubscribe();
        // };
      }

      case "!saveTask": {
        try {
          addDoc(collection(db, path), {
            ...doEffect.data,
            creationDate: Timestamp.now(),
          });
        } catch (err) {
          console.log(err);
        }

        dispatch({ type: "endedSaveTask" });
        break;
      }

      case "!updateTask": {
        const taskDocRef = doc(db, path, doEffect.data.id);
        try {
          updateDoc(taskDocRef, doEffect.data.taskItem);
        } catch (err) {
          console.log(err);
        }
        dispatch({ type: "endedSaveTask" });
        break;
      }

      case "!deleteTask": {
        const taskDocRef = doc(db, path, doEffect.data);
        try {
          deleteDoc(taskDocRef);
        } catch (err) {
          console.log(err);
        }
        dispatch({ type: "endedDeleteTask" });
        break;
      }

      default: {
        break;
      }
    }
  }, [doEffect]);
}
