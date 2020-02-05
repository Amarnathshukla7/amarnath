import axios from "axios";
import { get } from "idb-keyval";

export const init = async () => {
  const { token } = await get("token");
  return axios.post(`/reservation-svc/${token}`).then(res => res.data);
};

export const confirm = async () => {
  const { token } = await get("token");
  return axios.post(`/reservation-svc/${token}`).then(res => res.data);
};
