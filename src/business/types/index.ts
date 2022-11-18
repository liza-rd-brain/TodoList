export type State = {
  data: any;
  view: "list" | "card" | "loading";
};

export type ActionType =
  | { type: "loadTaskList"; payload: any }
  | { type: "editTask" }
  | { type: "deleteTask" }
  | { type: "saveTask" }
  | { type: "checkDone" }
  | { type: "changeView" };
