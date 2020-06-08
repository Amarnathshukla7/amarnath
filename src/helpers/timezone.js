import { addMinutes, subMinutes } from "date-fns";

export const formatTimezone = (date) => {
  const offset = date.getTimezoneOffset();

  return Math.sign(offset) !== -1
    ? addMinutes(date, offset)
    : subMinutes(date, Math.abs(offset));
};
