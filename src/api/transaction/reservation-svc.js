import { reservationClient } from "../axios";

export const create = async (vm, token, data) => {
  const accessToken = localStorage.getItem("auth._token.local");
  return reservationClient(vm)
    .post(`/reservations/${token}`, data, {
      headers: {
        ...(accessToken && { Authorization: accessToken }),
      },
    })
    .then((res) => res.data);
};

export const getReservation = async (vm, token, data) => {
  return reservationClient(vm)
    .get(
      `/carts/${token}/reservations?filter[reservations.status]=success`,
      data,
    )
    .then((res) => res.data.data[0]);
};
