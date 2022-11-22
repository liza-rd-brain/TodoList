import dayjs from "dayjs";
import { useEffect } from "react";
import { useAppContext } from "../../AppProvider";
import { addExpire } from "../helpers";
import { checkIsExpired } from "../helpers/checkIsExpired";
import { DataType, DateType } from "../types";

export function useCheckExpired() {
  const {
    state: { doEffect, currTask, data },
    dispatch,
  } = useAppContext();

  const UPDATE_TIME = 3000;
  // const UPDATE_TIME = 30000;

  const checkExpiration = () => {
    if (data) {
      //   const newDataWithExpired = data.map((currItem) => {
      //     const hasDate = currItem.value.endDate && currItem.value.endDate?.date;
      //     if (hasDate) {
      //       const isExpired = checkIsExpired(currItem.value.endDate as DateType);
      //       return { ...currItem, isExpired };
      //     } else {
      //       return currItem;
      //     }
      //   });
      const newDataWithExpired = addExpire(data);

      dispatch({ type: "updateExpired", payload: newDataWithExpired });
    }
    return;
  };

  useEffect(() => {
    const hasNotExpiredTask = data?.find(
      (item) => !item.isExpired && item.value.endDate?.date
    );
    if (!doEffect && data?.length && hasNotExpiredTask) {
      const interval = setInterval(checkExpiration, UPDATE_TIME);

      return () => clearTimeout(interval);
    }
  }, [data?.length, doEffect]);
}
