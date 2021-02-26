import { format } from "date-fns";
import { enGB, fr, de, es } from "date-fns/locale";
import { formatTimezone } from "../helpers/timezone";

export const formatDate = (date, locale) => {
  return format(formatTimezone(new Date(date)), "EEE d MMM", {
    locale: dateLocales[locale],
  });
};

const dateLocales = {
  "en-GB": enGB,
  fr,
  de,
  es,
};
