import axios from "axios";
import { get } from "idb-keyval";

export const create = async (data) => {
  const { token } = await get("token");
  const accessToken = localStorage.getItem("auth._token.local");
  return axios
    .post(`/reservation-svc/${token}`, data, {
      headers: {
        ...(accessToken && { Authorization: accessToken }),
      },
    })
    .then((res) => res.data);
};
