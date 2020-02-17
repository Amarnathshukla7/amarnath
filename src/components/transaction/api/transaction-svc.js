import axios from "axios";
import { get } from "idb-keyval";

export const create = async (gateway, deposit) => {
  const { token } = await get("token");

  return axios
    .post(`/transaction-svc/${token}`, {
      gateway,
      deposit,
    })
    .then(res => res.data);
};
