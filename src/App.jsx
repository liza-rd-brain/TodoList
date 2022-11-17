import "./App.less";
import dayjs from "dayjs";

import { useRef } from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfBa8rWLeCWjICY3bsJjW-Nk7U7tDtp5M",
  authDomain: "tododatabase-acb1e.firebaseapp.com",
  projectId: "tododatabase-acb1e",
  storageBucket: "tododatabase-acb1e.appspot.com",
  messagingSenderId: "980011734471",
  appId: "1:980011734471:web:bf12057b9904de20e535e2",
};

export function App() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  console.log("app", app);
  console.log(dayjs().day());

  const textInput = useRef({ value: null });

  const addData = () => {
    const db = getDatabase();
    console.log("db", db);
    // console.log(textInput.current.value);
    set(ref(db, "todoList/"), {
      testInput: textInput.current.value,
    });

    const dbRef = ref(getDatabase());

    get(child(dbRef, `todoList/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">TODO</header>
      <input ref={textInput} type="text" />
      <button onClick={addData}> + </button>
    </div>
  );
}
