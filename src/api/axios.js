import axios from "axios";

function checkEnvVariable(key) {
  if (!process.env[key]) {
    throw new Error(`The ${key} envrionment variable is required`);
  }
}

export const searchClient = () => {
  checkEnvVariable("VUE_APP_SEARCH_SVC_URL");
  return axios.create({
    baseURL: process.env.VUE_APP_SEARCH_SVC_URL,
  });
};

export const reservationClient = () => {
  checkEnvVariable("VUE_APP_RESERVATION_SVC_URL");
  return axios.create({
    baseURL: process.env.VUE_APP_RESERVATION_SVC_URL,
  });
};
