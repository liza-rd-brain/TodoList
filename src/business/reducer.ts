import { useAppContext } from "../AppProvider";
import { ActionType, DataType, State } from "./types";

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

        case "openedTask": {
          const newCurrTask = state.data?.find((item) => {
            return item.id === action.payload;
          }) as DataType;

          const newState: State = {
            ...state,
            view: "card",
            phase: { type: "cardEditing" },
            currTask: newCurrTask,
          };

          return newState;
        }

        case "updateExpired": {
          const newState: State = {
            ...state,
            data: action.payload,
          };

          return newState;
        }
      }
    }

    case "cardEditing": {
      switch (action.type) {
        case "startedSaveTask": {
          //сохраняем задачу, если закончилась загрузка файлов
          if (!state.doEffect?.type) {
            const newState: State = {
              ...state,
              doEffect: { type: "!updateTask", data: action.payload },
            };

            return newState;
          }
          break;
        }

        case "endedSaveTask": {
          const newState: State = {
            ...state,
            view: "loading",
            doEffect: { type: "!loadFireBase" },
            phase: { type: "waitingTaskList" },
          };
          return newState;
        }
        case "startedAddFile": {
          const newState: State = {
            ...state,
            doEffect: { type: "!loadFile", data: action.payload as FileList },
            // phase: { type: "fileAdding" },
          };
          return newState;
        }

        case "endedAddFile": {
          const newState: State = {
            ...state,
            doEffect: null,
          };

          return newState;
        }

        case "startedDeleteTask": {
          const newState: State = {
            ...state,
            doEffect: { type: "!deleteTask", data: action.payload },
          };

          return newState;
        }

        case "endedDeleteTask": {
          const newState: State = {
            ...state,
            view: "loading",
            doEffect: { type: "!loadFireBase" },
            phase: { type: "waitingTaskList" },
            currTask: null,
          };
          return newState;
        }

        case "updateExpired": {
          const newState: State = {
            ...state,
            data: action.payload,
          };

          return newState;
        }
      }
    }

    case "cardCreating": {
      switch (action.type) {
        case "startedSaveTask": {
          //сохраняем задачу, если закончилась загрузка файлов
          if (!state.doEffect?.type) {
            const newState: State = {
              ...state,
              doEffect: { type: "!saveTask", data: action.payload },
            };
            return newState;
          }
          break;
        }

        case "endedSaveTask": {
          const newState: State = {
            ...state,
            view: "loading",
            doEffect: { type: "!loadFireBase" },
            phase: { type: "waitingTaskList" },
          };
          return newState;
        }

        case "startedAddFile": {
          const newState: State = {
            ...state,
            doEffect: { type: "!loadFile", data: action.payload as FileList },
          };
          return newState;
        }

        case "endedAddFile": {
          const newState: State = {
            ...state,
            doEffect: null,
          };
          return newState;
        }

        case "changeView": {
          return changeView(state);
        }

        case "startedDeleteTask": {
          return changeView(state);
        }

        case "updateExpired": {
          const newState: State = {
            ...state,
            data: action.payload,
          };

          return newState;
        }
      }
    }

    /*   case "fileAdding": {
      switch (action.type) {
        case "endedAddFile": {
          const newState: State = {
            ...state,
            doEffect: null,

            // currTask: {
            //   ...state.currTask,
            //   value: {
            //     ...state.currTask?.value,
            //     name: state.currTask?.value.name || "",
            //     desc: state.currTask?.value.desc || "",
            //     fileList: action.payload,
            //     isDone: false,
            //     endDate: null,
            //   },
            // },
          };

          return newState;
        }
      }
    } */

    case "waitingTaskList": {
      switch (action.type) {
        case "loadedTaskList": {
          const newState: State = {
            ...state,
            data: action.payload,
            view: "list",
            phase: { type: "idle" },
            doEffect: null,
          };

          return newState;
        }

        default:
          return state;
      }
    }

    default: {
      switch (action.type) {
        case "updateExpired": {
          const newState: State = {
            ...state,
            data: action.payload,
          };

          return newState;
        }
        default:
          return state;
      }
    }
  }
};
