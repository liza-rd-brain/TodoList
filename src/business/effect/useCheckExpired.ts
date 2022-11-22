import dayjs from "dayjs";
import { useEffect } from "react";
import { useAppContext } from "../../AppProvider";
import { DataValueType, FileItemList, FileItemType } from "../types";

export function useCheckExpired() {
  const {
    state: { doEffect, currTask, data },
    dispatch,
  } = useAppContext();

  const UPDATE_TIME = 3000;
  //   const UPDATE_TIME = 30000;

  const checkExpiration = () => {
    if (data) {
      const newDataWithExpired = data.map((currItem) => {
        const currDateExpired = currItem.value.endDate;
        if (currDateExpired) {
          const endDateTimeStamp = dayjs(
            currDateExpired.date + currDateExpired.time
          ).format();

          const currTimeStamp = dayjs().format();
          const isExpired = endDateTimeStamp < currTimeStamp;
          return { ...currItem, expired: isExpired };
        } else {
          return currItem;
        }
      });

      dispatch({ type: "updateExpired", payload: newDataWithExpired });
    }
    return;
  };

  useEffect(() => {
    const hasNotExpiredTask = data?.find(
      (item) => /* item.value.!isExpired? */ item.value.endDate?.date
    );
    if (!doEffect && data?.length && hasNotExpiredTask) {
      const interval = setInterval(checkExpiration, UPDATE_TIME);

      return () => clearTimeout(interval);
    }
  }, [data?.length, doEffect]);
}
