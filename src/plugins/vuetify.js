import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export const stc = {
  primary: "#062131",
  secondary: "#ff8700",
  accent: "#2aa6b9",
  error: "#FF5252",
  info: "#e4e6ea",
  other: "#dcf3f7",
  success: "#4CAF50",
  warning: "#eb3a3a",
  greyish: "#899495",
  greyback: "#f8f8f8",
  tealish: "#54B8C7",
};

export const fp = {
  primary: "#4e5b67",
  secondary: "#ff6016",
  accent: "#bfc8c5",
  error: "#FF5252",
  info: "#edf2f0",
  other: "#dcf3f7",
  success: "#4CAF50",
  warning: "#eb3a3a",
  greyish: "#71767b",
  greyback: "#f8f8f8",
};

export const cph = {
  primary: "#454544",
  secondary: "#ff8700",
  accent: "#4fb696",
  error: "#FF5252",
  info: "#e4e6ea",
  other: "#dcf3f7",
  success: "#4CAF50",
  warning: "#eb3a3a",
  greyish: "#899495",
  greyback: "#f8f8f8",
};

export const nh = {
  primary: "#454544",
  secondary: "#ff8700",
  accent: "#199dda",
  error: "#FF5252",
  info: "#e4e6ea",
  other: "#dcf3f7",
  success: "#4CAF50",
  warning: "#eb3a3a",
  greyish: "#899495",
  greyback: "#f8f8f8",
};

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: stc,
      // light: fp,
      // light: cph,
      // light: nh,
    },
  },
  icons: {
    iconfont: "mdi",
  },
});
