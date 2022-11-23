import { useEffect } from "react";
import { useAppContext } from "../../AppProvider";

/**
 * hook for closing portal on click outside
 */
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
      //clean up ref store when portal closed
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
