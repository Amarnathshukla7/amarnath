import { reservationClient } from "../axios";

export const discount = async (vm, code, token) => {
  return reservationClient(vm)
    .put(`/carts/${token}/discounts/${code}`)
    .then((res) => res.data);
};

export const addExtra = async (vm, extra, token) => {
  return reservationClient(vm)
    .post(`/carts/${token}/items`, {
      ...extra,
    })
    .then((res) => res.data);
};

export const deleteExtra = async (vm, code, token) => {
  return reservationClient(vm)
    .delete(`/carts/${token}/items/${code}`)
    .then((res) => res.data);
};

export const getCurrencyRate = async (vm, currency, token) => {
  return reservationClient(vm)
    .get(`/carts/${token}/currency/${currency}`)
    .then((res) => parseFloat(res.data.rate));
};
