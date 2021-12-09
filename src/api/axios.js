import axios from "axios";

function getURL(env, vm, fallbackStage, fallback) {
  if (env) {
    return env;
  }

  if (vm.$store?.state?.bookingEngine?.isProduction === false) {
    return fallbackStage;
  }

  return fallback;
}

export const searchClient = (vm) => {
  return axios.create({
    baseURL: getURL(
      process.env.VUE_APP_SEARCH_SVC_URL,
      vm,
      "https://search-stage-svc-labmweueeq-nw.a.run.app",
      "https://search-svc-labmweueeq-nw.a.run.app",
    ),
  });
};

export const reservationClient = (vm) => {
  return axios.create({
    baseURL: getURL(
      process.env.VUE_APP_RESERVATION_SVC_URL,
      vm,
      "https://reservation.stage.bnb-platform.com/api",
      "https://reservation.bnb-platform.com/api",
    ),
  });
};
