import { useEffect } from "react";
import { addExpire } from "../helpers";
import { useAppContext } from "../../AppProvider";

/**
 * hook for updating expired condition
 * fired onсe in five second if has task, that may be expired:
 * - have date (and time) expiration
 * - dont have isDone mark as true
 * - or dont have isExpired mark as true
 */
export function useCheckExpired() {
  const {
    state: { doEffect, data },
    dispatch,
  } = useAppContext();

  const UPDATE_TIME = 5000;

  /**
   * if has task in list run check for expiration data
   */
  const checkExpiration = (): void => {
    if (data) {
      const newDataWithExpired = addExpire(data);
      dispatch({ type: "updateExpired", payload: newDataWithExpired });
    }
    return;
  };

  useEffect(() => {
    const hasNotExpiredTask = data?.find(
      (item) =>
        !item.isExpired && item.value.endDate?.date && !item.value.isDone
    );

    if (!doEffect && data?.length && hasNotExpiredTask) {
      const interval = setInterval(checkExpiration, UPDATE_TIME);

      return () => clearTimeout(interval);
    }
  }, [data?.length, doEffect]);
}
