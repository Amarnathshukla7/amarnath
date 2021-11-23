import axios from "axios";
import { resrvationClient } from "../../axios";

export const create = async (source, token) => {
  return resrvationClient
    .post(`/carts/${token}`, {
      source,
    })
    .then((res) => res.data);
};

export const get = async (token) => {
  return resrvationClient.get(`/carts/${token}`).then((res) => res.data);
};

export const getItems = async (token) => {
  return resrvationClient.get(`/carts/${token}/items`).then((res) => res.data);
};

export const updateOrCreate = async (room, dates, token) => {
  return resrvationClient
    .post(`/carts/${token}/items`, {
      ...dates,
    })
    .then((res) => res.data);
};

export const destroy = async (room, date, token) => {
  const appendDate = date ? `/${date}` : "";

  return resrvationClient
    .delete(`/carts/${token}/items/${room}${appendDate}`)
    .then((res) => res.data);
};
