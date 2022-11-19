import React, { useRef } from "react";
import "./Task.less";
import { useAppContext } from "../AppProvider";

import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export const Task = () => {
  const { state, dispatch } = useAppContext();

  const textInput = useRef<HTMLInputElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  let fileListTest: Array<any> = [];

  console.log(textInput.current);

  const closeModal = () => {
    dispatch({ type: "changeView" });
  };

  const getFileList = (fileObj: FileList) => {
    return Object.values(fileObj);
  };

  const addFiles = async () => {
    const newFileList = getFileList(fileInput.current?.files as FileList);
    console.log("newFileList", newFileList);
    //TODO:добавлять id для загрузки файлов!???
    newFileList.map((item) => {
      if (item) {
        const storageRef = ref(storage, `files/${item.name}`);
        const uploadTask = uploadBytesResumable(storageRef, item);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              fileListTest.push(downloadURL);
              console.log("File available at", downloadURL);
            });
            return;
          }
        );
      }
    });
  };

  const addData = async () => {
    try {
      addDoc(collection(db, "todo"), {
        name: textInput.current?.value,
        desc: textArea.current?.value,
        fileList: fileListTest,
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
