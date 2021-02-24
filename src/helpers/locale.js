export const getBestLocale = (userLocales) => {
  if (!Array.isArray(userLocales)) return "en-GB";
  const preferredLang = userLocales.find((locale) => {
    const languageCode = locale.split("-")[0];
    return (
      languageCode === "fr" || languageCode === "de" || languageCode === "es"
    );
  });
  if (preferredLang) {
    return preferredLang.split("-")[0];
  } else {
    return "en-GB";
  }
};
