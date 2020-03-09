import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

const stc = {
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
};

const fp = {
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
};

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      // light: stc,
      light: fp,
    },
  },
  icons: {
    iconfont: "mdi",
  },
});
