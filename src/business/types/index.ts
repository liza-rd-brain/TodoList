import { DocumentData } from "firebase/firestore";

export type State = {
  data: DataTypeList | null;
  view: "list" | "card" | "loading";
  doEffect: EffectType;
  phase: PhaseType;
  currTask: DataType | null;
};

//Хэлпер для рекурсивных необязательных полей
// type RecursivePartial<T> = {
//   [P in keyof T]?: RecursivePartial<T[P]>;
// };

export type DataTypeList = Array<DataType>;

export type DataTypePartial = {
  id: string;
  value: DataValueTypePartial;
  isExpired: boolean;
};

export type DataType = {
  id: string;
  value: DataValueType | DataValueTypePartial;
  isExpired: boolean;
};

export type DataValueTypePartial = Partial<DataValueType>;

export type LoadedDataType = Omit<DataType, "isExpired">;

export type DataValueType = {
  name: string;
  desc: string;
  isDone: boolean;
  fileList?: FileItemList | null;
  endDate: Partial<DateType> | null;
};

export type DateType = {
  date: string;
  time: string | null;
};

export type FileItemList = Array<FileItemType>;

export type FileItemType = { name: string; type: string; link: string };

export type TaskType = {
  fileList: FileItemList;
} | null;

export type EffectType =
  | { type: "!loadFireBase" }
  | { type: "!loadFile"; data: FileList }
  | { type: "!saveTask"; data: DataValueType }
  | { type: "!updateTask"; data: DataValueType }
  | { type: "!deleteTask"; data: string }
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
  | { type: "openedTask"; payload: string }
  | { type: "startedDeleteTask"; payload: string }
  | { type: "endedDeleteTask" }
  | { type: "saveTask" }
  | { type: "checkDone" }
  | { type: "changeView" }
  | { type: "updateExpired"; payload: DataTypeList };

// export type TodoItemType = {
//   id: string;
//   value: DocumentData;
// };

// export type TodoItemList = Array<TodoItemType>;
