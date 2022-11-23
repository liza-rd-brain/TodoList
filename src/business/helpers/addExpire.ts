import { checkIsExpired } from "./checkIsExpired";
import { DataTypeList, DataType, DateType, LoadedDataType } from "../types";

/**
 *
 * @param arr  - list of item from store or from firebase
 * @returns item with correct isExpired
 */
export function addExpire(arr: Array<DataType | LoadedDataType>): DataTypeList {
  return arr.map((currItem) => {
    const hasDate = currItem.value.endDate && currItem.value.endDate?.date;
    if (hasDate) {
      const isExpired = checkIsExpired(currItem.value.endDate as DateType);
      return { ...currItem, isExpired };
    } else {
      return { ...currItem, isExpired: false };
    }
  });
}
