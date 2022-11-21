import { DocumentData } from "firebase/firestore";

export type State = {
  data: DataTypeList | null;
  view: "list" | "card" | "loading";
  doEffect: EffectType;
  phase: PhaseType;
  currTask: RecursivePartial<DataType> | null;
};

//Хэлпер для рекурсивных необязательных полей
type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type DataTypeList = Array<DataType>;

export type DataType = {
  id: string;
  value: DataValueType;
};

export type DataValueType = {
  name: string;
  desc: string;
  fileList?: FileItemList;
};

export type FileItemList = Array<FileItemType>;

export type FileItemType = { name: string; type: string; link: string };

export type TaskType = {
  fileList: FileItemList;
} | null;

export type EffectType =
  | { type: "!loadFireBase" }
  | { type: "!loadFile"; data: FileList | null | undefined }
  | { type: "!saveTask"; data: DataValueType }
  | { type: "!updateTask"; data: DataValueType }
  | null;

export type PhaseType =
  | { type: "waitingTaskList" }
  | { type: "cardCreating" }
  | { type: "cardEditing" }
  | { type: "fileAdding" }
  | { type: "idle" };

export type ActionType =
  | { type: "loadedTaskList"; payload: DataTypeList }
  | { type: "startedAddFile"; payload: FileList | null | undefined }
  | { type: "endedAddFile"; payload: FileItemList }
  | { type: "startedSaveTask"; payload: DataValueType }
  | { type: "endedSaveTask" }
  | { type: "endedUpdateTask" }
  | { type: "openedTask"; payload: string }
  | { type: "deleteTask" }
  | { type: "saveTask" }
  | { type: "checkDone" }
  | { type: "changeView" };

// export type TodoItemType = {
//   id: string;
//   value: DocumentData;
// };

// export type TodoItemList = Array<TodoItemType>;
