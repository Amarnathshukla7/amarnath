import axios from "axios";
import { resrvationClient } from "../axios";

export const discount = async (code, token) => {
  return resrvationClient
    .put(`/carts/${token}/discounts/${code}`)
    .then((res) => res.data);
};

export const addExtra = async (extra, token) => {
  return resrvationClient
    .post(`/carts/${token}/items`, {
      ...extra,
    })
    .then((res) => res.data);
};

export const deleteExtra = async (code, token) => {
  return resrvationClient
    .delete(`/carts/${token}/items/${code}`)
    .then((res) => res.data);
};

export const getCurrencyRate = async (currency, token) => {
  return resrvationClient
    .get(`/carts/${token}/currency/${currency}`)
    .then((res) => parseFloat(res.data.rate));
};
