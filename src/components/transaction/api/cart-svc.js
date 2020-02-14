import axios from "axios";
import { get } from "idb-keyval";

export const discount = async code => {
  const { token } = await get("token");

  return axios.put(`/cart-svc/${token}/discount/${code}`).then(res => res.data);
};

export const deposit = async model => {
  const { token } = await get("token");

  return axios
    .put(`/cart-svc/${token}/deposits/${model}`)
    .then(res => res.data);
};
