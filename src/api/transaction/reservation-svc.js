import axios from "axios";
import { get } from "idb-keyval";

export const create = async (token, data) => {
  const accessToken = localStorage.getItem("auth._token.local");
  return axios
    .post(`/reservation-svc/${token}`, data, {
      headers: {
        ...(accessToken && { Authorization: accessToken }),
      },
    })
    .then((res) => res.data);
};
