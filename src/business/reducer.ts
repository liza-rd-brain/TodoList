import { ActionType, DataType, PhaseInnerType, State } from "./types";

export const initialState: State = {
  data: null,
  view: "loading",
  doEffect: { type: "!loadFireBase" },
  phase: { type: "waitingTaskList" },
  currTaskId: null,
};

/**
 * switch view between `list` and `card`
 */
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
      phase: { type: "previewCard" },
      currTaskId: null,
    };
    return newState;
  } else return state;
};

/**
 *
 * @param state - application state
 * @param action - describe what to do and  with what data
 * @returns new application state
 */
export const reducer = (
  state: State = initialState,
  action: ActionType
): State => {
  const [phaseOuter, phaseInner] = state.phase.type.split(".");

  switch (phaseOuter) {
    case "previewCard": {
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
            currTaskId: newCurrTask.id,
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

        case "startedDeleteTask": {
          const newState: State = {
            ...state,
            doEffect: { type: "!deleteTask", data: action.payload as string },
          };

          return newState;
        }

        case "endedDeleteTask": {
          const newState: State = {
            ...state,
            view: "loading",
            doEffect: { type: "!loadFireBase" },
            phase: { type: "waitingTaskList" },
            currTaskId: null,
          };
          return newState;
        }

        case "startedChangeDone": {
          if (!state.doEffect?.type) {
            const newState: State = {
              ...state,
              doEffect: { type: "!updateTask", data: action.payload },
              phase: { type: "doneEditing.previewCard" },
            };

            return newState;
          } else {
            return state;
          }
        }

        default: {
          return state;
        }
      }
    }

    case "cardEditing": {
      switch (action.type) {
        case "startedEditTask": {
          //сохраняем задачу, если закончилась загрузка файлов
          if (!state.doEffect?.type) {
            const newState: State = {
              ...state,
              doEffect: { type: "!updateTask", data: action.payload },
            };

            return newState;
          } else {
            return state;
          }
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

        case "startedDeleteTask": {
          const newState: State = {
            ...state,
            doEffect: { type: "!deleteTask", data: action.payload as string },
          };

          return newState;
        }

        case "endedDeleteTask": {
          const newState: State = {
            ...state,
            view: "loading",
            doEffect: { type: "!loadFireBase" },
            phase: { type: "waitingTaskList" },
            currTaskId: null,
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

        case "startedChangeDone": {
          if (!state.doEffect?.type) {
            const newState: State = {
              ...state,
              doEffect: { type: "!updateTask", data: action.payload },
              phase: { type: "doneEditing.cardEditing" },
            };

            return newState;
          } else {
            return state;
          }
        }

        case "changeView": {
          return changeView(state);
        }

        default: {
          return state;
        }
      }
    }

    case "cardCreating": {
      switch (action.type) {
        case "startedSaveTask": {
          //save task only if ended file loading
          if (!state.doEffect?.type) {
            const newState: State = {
              ...state,
              doEffect: { type: "!saveTask", data: action.payload },
            };
            return newState;
          } else {
            return state;
          }
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

        default: {
          return state;
        }
      }
    }

    case "waitingTaskList": {
      switch (action.type) {
        case "loadedTaskList": {
          const newState: State = {
            ...state,
            data: action.payload,
            view: "list",
            phase: { type: "previewCard" },
            doEffect: null,
          };

          return newState;
        }

        default:
          return state;
      }
    }

    case "doneEditing": {
      switch (action.type) {
        case "endedSaveTask": {
          const newState: State = {
            ...state,
            doEffect: { type: "!loadFireBase" },
          };
          return newState;
        }

        case "loadedTaskList": {
          const newPhase = phaseInner as PhaseInnerType;

          switch (newPhase) {
            case "cardEditing": {
              const newCurrTask = action.payload.find((item) => {
                return item.id === state.currTaskId;
              });

              const newState: State = {
                ...state,
                data: action.payload,
                view: "card",
                phase: { type: newPhase },
                doEffect: null,
                currTaskId: newCurrTask?.id || null,
              };

              return newState;
            }
            case "previewCard": {
              const newState: State = {
                ...state,
                data: action.payload,
                view: "list",
                phase: { type: newPhase },
                doEffect: null,
              };

              return newState;
            }
            default: {
              return state;
            }
          }
        }

        case "changeView": {
          return changeView(state);
        }

        default: {
          return state;
        }
      }
    }

    case "updatingTaskList": {
      switch (action.type) {
        case "loadedTaskList": {
          const newState: State = {
            ...state,
            data: action.payload,
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
