import axios from "axios";
import { get } from "idb-keyval";

export const create = async (gateway, deposit = 100, currency) => {
  const { token } = await get("token");

  return axios
    .post(`/transaction-svc/${token}`, {
      gateway,
      deposit,
      currency,
    })
    .then((res) => res.data);
};
