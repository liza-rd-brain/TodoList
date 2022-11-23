import { useEffect } from "react";
import { useAppContext } from "../../AppProvider";

export function useClosePortal() {
  const {
    state: { view },
    dispatch,
    refContainer,
  } = useAppContext();

  const closeModal = (e: MouseEvent) => {
    const container = document.querySelector("#taskContainer") as Element;

    const withinBoundaries = e.composedPath().includes(container);
    if (!withinBoundaries) {
      //очищаем хранилище при закрытии окна задачи
      refContainer.current.fileList = [];

      dispatch({ type: "changeView" });
    }
  };

  useEffect(() => {
    if (view === "card") {
      document.addEventListener("click", closeModal);

      return () => {
        document.removeEventListener("click", closeModal);
      };
    }
  }, [view]);
}
