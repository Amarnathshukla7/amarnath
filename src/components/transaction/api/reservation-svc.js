import axios from "axios";
import { get } from "idb-keyval";

export const create = async (data) => {
  const { token } = await get("token");
  return axios.post(`/reservation-svc/${token}`, data).then((res) => res.data);
};
