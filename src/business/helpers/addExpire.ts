import { DataTypeList, DataType, DataValueType, DateType } from "../types";
import { checkIsExpired } from "./checkIsExpired";

//TODO: fix type like generic

export function addExpire(
  arr: Array<
    | DataType
    | {
        id: string;
        value: DataValueType;
      }
  >
): DataTypeList {
  return arr.map((currItem) => {
    const hasDate = currItem.value.endDate && currItem.value.endDate?.date;
    if (hasDate) {
      const isExpired = checkIsExpired(currItem.value.endDate as DateType);
      return { ...currItem, isExpired };
    } else {
      return currItem;
    }
  });
}
