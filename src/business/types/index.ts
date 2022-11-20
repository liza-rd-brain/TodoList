import { DocumentData } from "firebase/firestore";

export type State = {
  data: any;
  view: "list" | "card" | "loading";
  doEffect: EffectType;
  phase: PhaseType;
  currTask: TaskType;
};

export type DataType = {
  id: string;
  value: { name: string; desc: string };
  fileList: Array<string>;
};

export type TaskType = {
  fileList: Array<string>;
} | null;

export type EffectType =
  | { type: "!loadFireBase" }
  | { type: "!loadFile"; data: FileList }
  | null;

export type PhaseType =
  | { type: "waitingTaskList" }
  | { type: "cardCreating" }
  | { type: "fileAdding" }
  | { type: "idle" };

export type ActionType =
  | { type: "loadedTaskList"; payload: TodoItemList }
  | { type: "startedAddFile"; payload: FileList | null | undefined }
  | { type: "endedAddFile"; payload: Array<string> }
  | { type: "editTask" }
  | { type: "deleteTask" }
  | { type: "saveTask" }
  | { type: "checkDone" }
  | { type: "changeView" };

export type TodoItemType = {
  id: string;
  value: DocumentData;
};

export type TodoItemList = Array<TodoItemType>;
