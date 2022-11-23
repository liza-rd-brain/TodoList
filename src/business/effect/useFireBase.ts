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

import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";

import { addExpire } from "../helpers";
import { db, storage } from "../../firebase";
import { useAppContext } from "../../AppProvider";
import { FileItemList, FileItemType, LoadedDataType } from "../types";

export function useFireBase() {
  const {
    state: { doEffect, currTask },
    dispatch,
    refContainer,
  } = useAppContext();

  useEffect(() => {
    switch (doEffect?.type) {
      /* Автоматически подтягивает данные из бд */
      case "!loadFireBase": {
        const currQuery = query(
          collection(db, "todo"),
          orderBy("creationDate")
        );

        const unsubscribe = onSnapshot(currQuery, (querySnapshot) => {
          const todoList = querySnapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                value: doc.data(),
              } as LoadedDataType)
          );

          //TODO: поправить тип хранить  в бд без отметки
          const listWithMark = addExpire(todoList);

          console.log(listWithMark);

          dispatch({ type: "loadedTaskList", payload: listWithMark });
        });
        break;

        /* Нужна ли отписка и контроль за обновлением-?! */
        // return () => {
        //   console.log("отписка");
        //   unsubscribe();
        // };
      }

      case "!loadFile": {
        const prevFileList = currTask?.value?.fileList as FileItemList;
        let currFileList: FileItemList =
          currTask && prevFileList ? [...prevFileList] : [];

        const data = doEffect.type === "!loadFile" ? doEffect.data : null;
        if (data) {
          const newFileList = Object.values(data);

          try {
            const result = Promise.all<Promise<FileItemType>[]>(
              newFileList.map((fileItem) => {
                return new Promise((resolve, reject) => {
                  const storageRef = ref(storage, `files/${fileItem.name}`);
                  const uploadTask = uploadBytesResumable(storageRef, fileItem);

                  uploadBytes(storageRef, fileItem).then((snapshot) => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                      (downloadURL) => {
                        resolve({
                          link: downloadURL,
                          name: fileItem.name,
                          type: fileItem.type,
                        });
                      }
                    );
                  });
                });
              })
            );

            result.then(
              (res: FileItemList) => {
                console.log("before res", refContainer);
                console.log("currFileList", currFileList);

                refContainer.current.fileList = refContainer.current.fileList
                  ? [...refContainer.current.fileList, ...res, ...currFileList]
                  : res;

                console.log("after res", refContainer);

                dispatch({
                  type: "endedAddFile",
                });
              },
              (err) => {
                console.log(err);
              }
            );
          } catch (err) {
            console.log(err);
          }
        }
        break;
      }

      case "!saveTask": {
        console.log("saveTask", doEffect.data);

        try {
          addDoc(collection(db, "todo"), {
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
        console.log("updateTask", doEffect.data);
        const currId = currTask?.id as string;
        const taskDocRef = doc(db, "todo", currId);
        try {
          updateDoc(taskDocRef, doEffect.data);
        } catch (err) {
          console.log(err);
        }
        dispatch({ type: "endedSaveTask" });
        break;
      }

      case "!deleteTask": {
        const taskDocRef = doc(db, "todo", doEffect.data);
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
