import { useEffect, useRef } from "react";
import { useAppContext } from "../../AppProvider";

import { db, storage } from "../../firebase";
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  UploadTask,
  uploadBytes,
} from "firebase/storage";
import { FileItemList, FileItemType } from "../types";

export function useFireBase() {
  const {
    state: { doEffect, currTask },
    dispatch,
  } = useAppContext();

  useEffect(() => {
    switch (doEffect?.type) {
      case "!loadFireBase": {
        const q = query(collection(db, "todo"));

        onSnapshot(q, (querySnapshot) => {
          const todoList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            value: doc.data(),
          }));

          dispatch({ type: "loadedTaskList", payload: todoList });
        });
      }

      case "!loadFile": {
        let fileList: FileItemList = currTask ? [...currTask.fileList] : [];
        console.log("initFileList", fileList);

        const data = doEffect.type === "!loadFile" ? doEffect.data : null;
        if (data) {
          const newFileList = Object.values(data);

          try {
            const result = Promise.all<Promise<FileItemType>[]>(
              newFileList.map((fileItem) => {
                console.log("fileItem", fileItem);
                return new Promise((resolve, reject) => {
                  const storageRef = ref(storage, `files/${fileItem.name}`);
                  const uploadTask = uploadBytesResumable(storageRef, fileItem);

                  uploadBytes(storageRef, fileItem).then((snapshot) => {
                    console.log("Uploaded a blob or file!");
                    getDownloadURL(uploadTask.snapshot.ref).then(
                      (downloadURL) => {
                        console.log("File available at", downloadURL);

                        console.log("downloadURL", downloadURL);
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
                fileList.push(...res);

                dispatch({
                  type: "endedAddFile",
                  payload: fileList,
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
      }

      default: {
        break;
      }
    }
  }, [doEffect]);
}
