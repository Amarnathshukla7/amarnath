import axios from "axios";
import { get } from "idb-keyval";

export const create = async gateway => {
  const { token } = await get("token");

  return axios
    .post(`/transaction-svc/${token}`, {
      gateway,
    })
    .then(res => res.data);
};
