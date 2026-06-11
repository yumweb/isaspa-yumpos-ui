import dayjs from "dayjs";
export const defaultStartTime = dayjs()
.set('hour', 9).set('minute', 0).set('second', 0)
.format("YYYY-MM-DDTHH:mm");

export const defaultEndTime = dayjs()
.set('hour', 18).set('minute', 0).set('second', 0)
.format("YYYY-MM-DDTHH:mm");

export const weekDays = [
  {
    day: "1",
    weeklyOff: false,
    shiftStart: dayjs(defaultStartTime),
    shiftEnd: dayjs(defaultEndTime),
  },
  {
    day: "2",
    weeklyOff: false,
    shiftStart: dayjs(defaultStartTime),
    shiftEnd: dayjs(defaultEndTime),
  },
  {
    day: "3",
    weeklyOff: false,
    shiftStart: dayjs(defaultStartTime),
    shiftEnd: dayjs(defaultEndTime),
  },
  {
    day: "4",
    weeklyOff: false,
    shiftStart: dayjs(defaultStartTime),
    shiftEnd: dayjs(defaultEndTime),
  },
  {
    day: "5",
    weeklyOff: false,
    shiftStart: dayjs(defaultStartTime),
    shiftEnd: dayjs(defaultEndTime),
  },
  {
    day: "6",
    weeklyOff: false,
    shiftStart: dayjs(defaultStartTime),
    shiftEnd: dayjs(defaultEndTime),
  },
  {
    day: "7",
    weeklyOff: false,
    shiftStart: dayjs(defaultStartTime),
    shiftEnd: dayjs(defaultEndTime),
  },
];
