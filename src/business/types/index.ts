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

export type DataType = {
  id: string;
  value: DataValueType;
  isExpired: boolean;
};

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

export type EffectType =
  | { type: "!loadFireBase" }
  | { type: "!loadFile"; data: FileList }
  | { type: "!saveTask"; data: DataValueType }
  | { type: "!updateTask"; data: { taskItem: DataValueType; id: string } }
  | { type: "!deleteTask"; data: string }
  | null;

export type PhaseType =
  | { type: "waitingTaskList" }
  | { type: "updatingTaskList" }
  | { type: "cardCreating" }
  | { type: "cardEditing" }
  | { type: "doneEditing.cardEditing" }
  | { type: "doneEditing.previewCard" }
  | { type: "previewCard" };

export const PhaseInner = ["cardEditing", "previewCard"] as const;

export type PhaseInnerType = typeof PhaseInner[number];

export type ActionType =
  | { type: "loadedTaskList"; payload: DataTypeList }
  | { type: "startedAddFile"; payload: FileList | null | undefined }
  | { type: "endedAddFile" }
  | { type: "startedSaveTask"; payload: DataValueType }
  | { type: "endedSaveTask" }
  | { type: "openedTask"; payload: string }
  | { type: "startedDeleteTask"; payload: string }
  | { type: "endedDeleteTask" }
  | { type: "changeView" }
  | { type: "updateExpired"; payload: DataTypeList }
  | {
      type: "startedChangeDone";
      payload: { taskItem: DataValueType; id: string };
    }
  | { type: "endedChangeDone" };
