import dayjs from "dayjs";

export const checkIsExpired = (currData: { date: string; time?: string }) => {
  const dayString = currData?.date + currData?.time;
  const endDateTimeStamp = dayjs(dayString).format();

  const currTimeStamp = dayjs().format();
  const isExpired = endDateTimeStamp < currTimeStamp;
  return isExpired;
};
