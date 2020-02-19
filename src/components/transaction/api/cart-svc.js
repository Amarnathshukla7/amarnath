import axios from "axios";
import { get } from "idb-keyval";

export const discount = async code => {
  const { token } = await get("token");

  return axios
    .put(`/cart-svc/${token}/discounts/${code}`)
    .then(res => res.data);
};