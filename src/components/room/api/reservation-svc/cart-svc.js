import axios from "axios";
import { get } from "idb-keyval";

export const updateOrCreate = async (room, dates) => {
  const { token } = await get("token");

  return axios
    .post(`/cart-svc/${token}/${room}`, {
      items: dates,
      bookingSource: "STC",
    })
    .then(res => res.data);
};

export const destroy = async (room, date) => {
  const { token } = await get("token");

  return axios
    .delete(`/cart-svc/${token}/${room}/${date || ""}`)
    .then(res => res.data);
};
