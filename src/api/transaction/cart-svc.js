import axios from "axios";

export const discount = async (code, token) => {
  return axios
    .put(`/cart-svc/${token}/discounts/${code}`)
    .then((res) => res.data);
};

export const addExtra = async (extra, token) => {
  return axios
    .post(`/cart-svc/${token}/items`, {
      ...extra,
    })
    .then((res) => res.data);
};

export const deleteExtra = async (code, token) => {
  return axios
    .delete(`/cart-svc/${token}/items/${code}`)
    .then((res) => res.data);
};

export const getCurrencyRate = async (currency, token) => {
  return axios
    .get(`/cart-svc/${token}/currency/${currency}`)
    .then((res) => parseFloat(res.data.rate));
};
