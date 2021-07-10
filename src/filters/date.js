import { format } from "date-fns";
import { formatTimezone } from "../helpers/timezone";
import Trans from "@/plugins/translation";

export const formatDate = (date, locale) => {
  return format(formatTimezone(new Date(date)), "EEE d MMM", {
    locale: Trans.dateLocales[locale],
  });
};
