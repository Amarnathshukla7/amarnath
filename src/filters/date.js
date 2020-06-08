import { format } from "date-fns";
import { formatTimezone } from "../helpers/timezone";

export const formatDate = (date) => {
  return format(formatTimezone(new Date(date)), "EEE d MMM");
};
