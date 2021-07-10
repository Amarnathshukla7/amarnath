import i18n from "@/i18n";
import { de, enGB, es, fr } from "date-fns/locale";

export default {
  /**
   * Returns default language.
   *
   * @returns {*}
   */
  get defaultLocale() {
    return process.env.VUE_APP_I18N_LOCALE;
  },
  /**
   * Used for language picker
   * @returns {[{code: string, flag: string, text: string}, {code: string, flag: string, text: string}, {code: string, flag: string, text: string}, {code: string, flag: string, text: string}]}
   */
  get supportedLocales() {
    return [
      {
        text: "English",
        code: "en-GB",
        flag:
          "https://images.ctfassets.net/4mnpckaz5cg6/7blI7R03OeOjpLZRmxJqgs/3603dd177b3be067c3c81f3f5a96851e/british-flag.svg",
      },
      {
        text: "Français",
        code: "fr",
        flag:
          "https://images.ctfassets.net/4mnpckaz5cg6/2U2SDTBhtXCUaOROaCMhVx/a41103c3c31e1b780ab390fbcba3a729/french-flag.svg",
      },
      {
        text: "Deutsch",
        code: "de",
        flag:
          "https://images.ctfassets.net/4mnpckaz5cg6/c3j2VkwHW17Cpf52q9yp2/dd92f2e003a5763060e775100d8b1f2a/german-flag.svg",
      },
      {
        text: "Español",
        code: "es",
        flag:
          "https://images.ctfassets.net/4mnpckaz5cg6/1kqHQeUE4QEsw0K2qMfdqp/55c3f271c1154ed83f7a47a818a5289c/spanish-flag.svg",
      },
    ];
  },
  /**
   * Used for date translations
   * @returns {{de: Locale | de, fr: Locale | fr, "en-GB": Locale | enGB, es: Locale | es}}
   */
  get dateLocales() {
    return {
      "en-GB": enGB,
      fr,
      de,
      es,
    };
  },
  /**
   * Returns current language.
   *
   * @returns {*}
   */
  get currentLocale() {
    return i18n.locale;
  },
  /**
   * Sets current language.
   * @param locale
   */
  set currentLocale(locale) {
    i18n.locale = locale;
  },
};
