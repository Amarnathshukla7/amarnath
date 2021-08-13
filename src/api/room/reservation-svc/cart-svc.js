import axios from "axios";

export const create = async (source, token) => {
  return axios
    .post(`/cart-svc/${token}`, {
      source,
    })
    .then((res) => res.data);
};

export const get = async (token) => {
  return axios.get(`/cart-svc/${token}`).then((res) => res.data);
};

export const getItems = async (token) => {
  return axios.get(`/cart-svc/${token}/items`).then((res) => res.data);
};

export const updateOrCreate = async (room, dates, token) => {
  return axios
    .post(`/cart-svc/${token}/items`, {
      ...dates,
    })
    .then((res) => res.data);
};

export const destroy = async (room, date, token) => {
  const appendDate = date ? `/${date}` : "";

  return axios
    .delete(`/cart-svc/${token}/items/${room}${appendDate}`)
    .then((res) => res.data);
};
