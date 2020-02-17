import axios from "axios";

export const get = async ref => {
  return axios.get(`/reservation-svc/${ref}`).then(res => res.data);
};
