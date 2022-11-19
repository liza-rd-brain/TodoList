import { ActionType, State } from "./types";

export const initialState: State = {
  data: null,
  view: "loading",
  doEffect: { type: "!loadFireBase" },
  phase: { type: "waitingTaskList" },
};

export const reducer = (
  state: State = initialState,
  action: ActionType
): State => {
  const phase = state.phase.type;

  switch (phase) {
    case "idle": {
      switch (action.type) {
        case "changeView": {
          const newView = state.view === "card" ? "list" : "card";
          const newState: State = {
            ...state,
            view: newView,
          };

          return newState;
        }
      }
    }

    default: {
      switch (action.type) {
        case "loadedTaskList": {
          const newState: State = {
            ...state,
            data: action.payload,
            view: "list",
          };
          return newState;
        }

        case "editTask": {
          return state;
        }

        case "deleteTask": {
          return state;
        }

        case "saveTask": {
          return state;
        }
        case "checkDone": {
          return state;
        }

        default:
          return state;
      }
    }
  }
};
