import { ActionType, State } from "./types";

export const initialState: State = {
  data: null,
  view: "loading",
  doEffect: { type: "!loadFireBase" },
  phase: { type: "waitingTaskList" },
  currTask: null,
};

const changeView = (state: State): State => {
  if (state.view === "list") {
    const newState: State = {
      ...state,
      view: "card",
      phase: { type: "cardCreating" },
    };
    return newState;
  } else if (state.view === "card") {
    const newState: State = {
      ...state,
      view: "list",
      phase: { type: "idle" },
      currTask: null,
    };
    return newState;
  } else return state;
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
          return changeView(state);
        }
      }
    }

    case "cardCreating": {
      switch (action.type) {
        case "startedAddFile": {
          const newState: State = {
            ...state,
            doEffect: { type: "!loadFile", data: action.payload },
            phase: { type: "fileAdding" },
          };
          return newState;
        }

        case "changeView": {
          return changeView(state);
        }
      }
    }

    case "fileAdding": {
      switch (action.type) {
        case "endedAddFile": {
          const newState: State = {
            ...state,
            currTask: {
              fileList: action.payload,
            },
            doEffect: null,
            phase: { type: "cardCreating" },
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
            phase: { type: "idle" },
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
