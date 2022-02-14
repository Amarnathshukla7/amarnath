import { reservationClient } from "../../axios";

export const create = async (vm, source, token) => {
  return reservationClient(vm)
    .post(`/carts/${token}`, {
      source,
    })
    .then((res) => res.data);
};

export const getCart = async (vm, token) => {
  return reservationClient(vm)
    .get(`/carts/${token}`)
    .then((res) => res.data);
};

export const getItems = async (vm, token) => {
  return reservationClient(vm)
    .get(`/carts/${token}/items`)
    .then((res) => res.data);
};

export const updateOrCreate = async (vm, room, dates, token) => {
  return reservationClient(vm)
    .post(`/carts/${token}/items`, {
      ...dates,
    })
    .then((res) => res.data);
};

export const destroy = async (vm, room, date, token) => {
  const appendDate = date ? `/${date}` : "";

  return reservationClient(vm)
    .delete(`/carts/${token}/items/${room}${appendDate}`)
    .then((res) => res.data);
};
