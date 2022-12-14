import dayjs from "dayjs";

//если не установить время, но берем время до конца дня
/**
 *
 * @param currData  - data object, if content only date time set on `24:00`(end of the day)
 * @returns boolean value, mean date is expired or not
 */
export const checkIsExpired = (currData: { date: string; time?: string }) => {
  const defaultTime = "24:00";
  const dayString = currData?.time
    ? currData?.date + currData?.time
    : currData?.date + defaultTime;
  const endDateTimeStamp = dayjs(dayString).format();

  const currTimeStamp = dayjs().format();
  const isExpired = endDateTimeStamp < currTimeStamp;
  return isExpired;
};
