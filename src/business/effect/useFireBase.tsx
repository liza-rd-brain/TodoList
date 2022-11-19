import { useEffect, useRef } from "react";
import { useAppContext } from "../../AppProvider";

import { db, storage } from "../../firebase";
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";

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
        let fileList: Array<any> = currTask ? [...currTask.fileList] : [];
        console.log("initFileList", fileList);

        // const data = doEffect.data;
        const data = doEffect.type === "!loadFile" ? doEffect.data : null;
        if (data) {
          const newFileList = Object.values(data);
          // console.log("newFileList", newFileList);

          try {
            const result = Promise.all(
              newFileList.map((item) => {
                return new Promise((resolve, reject) => {
                  const storageRef = ref(storage, `files/${item.name}`);
                  const uploadTask = uploadBytesResumable(storageRef, item);

                  uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                      const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      console.log("Upload is " + progress + "% done");
                      switch (snapshot.state) {
                        case "paused":
                          console.log("Upload is paused");

                        case "running":
                          console.log("Upload is running");
                      }
                    },
                    reject,
                    () => {
                      getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                          console.log("File available at", downloadURL);
                          resolve(downloadURL);
                        }
                      );
                    }
                  );
                });
              })
            );

            result.then((res: any) => {
              console.log("all  promise done");
              console.log("res", res);
              fileList.push(...res);
              console.log("newFileList", fileList);
              dispatch({
                type: "endedAddFile",
                payload: fileList,
              });
            });
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
