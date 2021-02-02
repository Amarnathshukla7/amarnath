export const formatLocale = (userLocale) => {
  const languageCode = userLocale.split("-")[0];
  if (languageCode === "fr" || languageCode === "de" || languageCode === "es") {
    return languageCode;
  } else {
    return "en-GB";
  }
};
