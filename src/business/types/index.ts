export type State = {
  data: any;
  view: "list" | "card" | "loading";
  doEffect: EffectType;
  phase: PhaseType;
};

export type EffectType =
  | { type: "!loadFireBase" }
  | { type: "!loadFile" }
  | null;

export type PhaseType = { type: "waitingTaskList" } | { type: "idle" };

export type ActionType =
  | { type: "loadedTaskList"; payload: any }
  | { type: "editTask" }
  | { type: "deleteTask" }
  | { type: "saveTask" }
  | { type: "checkDone" }
  | { type: "changeView" };
