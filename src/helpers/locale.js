export const getBestLocale = (userLocales) => {
  if (!Array.isArray(userLocales)) return "en-GB";
  const preferredLang = userLocales.find((locale) => {
    const languageCode = locale.split("-")[0];
    return (
      languageCode === "en" ||
      languageCode === "fr" ||
      languageCode === "de" ||
      languageCode === "es"
    );
  });
  if (preferredLang) {
    const languageCode = preferredLang.split("-")[0];
    if (languageCode === "en") {
      return "en-GB";
    } else {
      return languageCode;
    }
  } else {
    return "en-GB";
  }
};
