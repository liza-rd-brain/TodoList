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
export function useLoadFile(
  currRefContainer: React.MutableRefObject<{
    fileList: FileItemList | [];
  }>
) {
  const {
    state: { doEffect, currTaskId, data },
    dispatch,
  } = useAppContext();

  useEffect(() => {
    const currTask = data?.find((item) => item.id === currTaskId);
    const prevFileList = currTask?.value?.fileList as FileItemList;
    let currFileList: FileItemList =
      currTask && prevFileList ? [...prevFileList] : [];

    const dataLoaded = doEffect?.type === "!loadFile" ? doEffect.data : null;
    if (dataLoaded) {
      const newFileList = Object.values(dataLoaded);

      try {
        const result = Promise.all<Promise<FileItemType>[]>(
          newFileList.map((fileItem) => {
            return new Promise((resolve, reject) => {
              const storageRef = ref(storage, `files/${fileItem.name}`);
              const uploadTask = uploadBytesResumable(storageRef, fileItem);

              uploadBytes(storageRef, fileItem).then((snapshot) => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  resolve({
                    link: downloadURL,
                    name: fileItem.name,
                    type: fileItem.type,
                  });
                });
              });
            });
          })
        );

        result.then(
          (res: FileItemList) => {
            currRefContainer.current.fileList = currRefContainer.current
              .fileList
              ? [...currRefContainer.current.fileList, ...res, ...currFileList]
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
  });
}
