import { useEffect } from "react";
import { useAppContext } from "../../AppProvider";

export function useClosePortal() {
  const {
    state: { view },
    dispatch,
  } = useAppContext();

  const closeModal = (e: MouseEvent) => {
    console.log("закрыть модалку");
    const container = document.querySelector("#taskContainer") as Element;

    const withinBoundaries = e.composedPath().includes(container);
    if (!withinBoundaries) {
      dispatch({ type: "changeView" });
    }
  };
  useEffect(() => {
    if (view === "card") {
      console.log("подписка");
      document.addEventListener("click", closeModal);

      return () => {
        document.removeEventListener("click", closeModal);
      };
    }
  }, [view]);
}
