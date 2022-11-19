import React, { useRef, useState } from "react";
import "./Task.less";
import { useAppContext } from "../AppProvider";

import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";

export const Task = () => {
  const { state, dispatch } = useAppContext();

  /**
   * В fileList можно добавить сразу несколько файлов
   * Добавление новых не перезаписывает старые
   */
  const fileList = useRef<Array<any>>([]);
  const textInput = useRef<HTMLInputElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    dispatch({ type: "changeView" });
  };

  const getFileList = (fileObj: FileList) => {
    return Object.values(fileObj);
  };

  const addFiles = async () => {
    const newFileList = getFileList(fileInput.current?.files as FileList);
    console.log("newFileList", newFileList);

    try {
      let result = Promise.all(
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
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  console.log("File available at", downloadURL);
                  resolve(downloadURL);
                });
              }
            );
          });
        })
      );

      result.then((res) => {
        console.log("all  promise done");
        console.log("res", res);
        fileList.current = [...fileList.current, ...res];
        console.log("fileList.current ", fileList.current);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const addData = async () => {
    try {
      addDoc(collection(db, "todo"), {
        name: textInput.current?.value,
        desc: textArea.current?.value,
        fileList: fileList.current,
      });
    } catch (err) {
      console.log(err);
    }

    console.log(textInput.current);
  };
  /*   React.MutableRefObject<HTMLDivElement | undefined> */
  return (
    <div className="task-container" id="taskContainer">
      <div className="header-panel">
        <button onClick={closeModal}>x</button>
      </div>
      <div className="task-content">
        <div className="content-row">
          <div>заголовок</div>
          <input
            required={true}
            ref={textInput}
            type="text"
            className="task-textinput"
            defaultValue=""
          />
        </div>
        <div className="content-row">
          <div>описание</div>
          <textarea
            ref={textArea}
            className="task-textarea"
            name="post"
            id="input"
            rows={10}
            cols={40}
          ></textarea>
        </div>
        <div className="content-row">
          <div>дата завершения</div>
          <div>{"добавить дату завершения"}</div>
        </div>
        <div className="content-row">
          <div>прикрепленные файлы</div>
          <input
            ref={fileInput}
            type="file"
            multiple
            onChange={(e) => {
              console.log("добавила файлы", e.target);
              addFiles();
            }}
          />
        </div>
      </div>
      <div className="bottom-panel">
        <button
          className="control-button button-delete"
          onClick={() => console.log("delete")}
        >
          delete
        </button>
        <button className="control-button button-save" onClick={addData}>
          save
        </button>
      </div>
    </div>
  );
};
