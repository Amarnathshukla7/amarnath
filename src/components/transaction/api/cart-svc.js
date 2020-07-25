import axios from "axios";
import { get } from "idb-keyval";

export const discount = async (code) => {
  const { token } = await get("token");

  return axios
    .put(`/cart-svc/${token}/discounts/${code}`)
    .then((res) => res.data);
};

export const addExtra = async (extra) => {
  const { token } = await get("token");

  return axios
    .post(`/cart-svc/${token}/items`, {
      ...extra,
    })
    .then((res) => res.data);
};

export const deleteExtra = async (code) => {
  const { token } = await get("token");

  return axios
    .delete(`/cart-svc/${token}/items/${code}`)
    .then((res) => res.data);
};

export const getCurrencyRate = async (currency) => {
  const { token } = await get("token");

  return axios
    .get(`/cart-svc/${token}/currency/${currency}`)
    .then((res) => res.data.rate);
};
