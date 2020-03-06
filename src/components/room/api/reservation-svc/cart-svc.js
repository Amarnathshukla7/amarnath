import axios from "axios";
import { get } from "idb-keyval";

export const create = async source => {
  const { token } = await get("token");

  return axios
    .post(`/cart-svc/${token}`, {
      source,
    })
    .then(res => res.data);
};

export const updateOrCreate = async (room, dates) => {
  const { token } = await get("token");

  return axios
    .post(`/cart-svc/${token}/items`, {
      ...dates,
    })
    .then(res => res.data);
};

export const destroy = async (room, date) => {
  const { token } = await get("token");

  const appendDate = date ? `/${date}` : "";

  return axios
    .delete(`/cart-svc/${token}/items/${room}${appendDate}`)
    .then(res => res.data);
};
