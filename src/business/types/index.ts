export type State = {
  data: any;
  view: "list" | "card" | "loading";
  doEffect: EffectType;
};
export type EffectType = { type: "!loadFireBase" } | null;

export type ActionType =
  | { type: "loadedTaskList"; payload: any }
  | { type: "editTask" }
  | { type: "deleteTask" }
  | { type: "saveTask" }
  | { type: "checkDone" }
  | { type: "changeView" };
