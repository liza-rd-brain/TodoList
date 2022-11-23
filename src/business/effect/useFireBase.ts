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
import { db, storage, path } from "../../firebase";
import { useAppContext } from "../../AppProvider";
import { FileItemList, FileItemType, LoadedDataType } from "../types";

/**
 * hook for interaction with firebase
 */
export function useFireBase() {
  const {
    state: { doEffect, currTask },
    dispatch,
    refContainer,
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
                refContainer.current.fileList = refContainer.current.fileList
                  ? [...refContainer.current.fileList, ...res, ...currFileList]
                  : res;

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
        // const currId = currTask?.id as string;
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
