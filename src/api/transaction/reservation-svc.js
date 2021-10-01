import axios from "axios";

export const create = async (token, data) => {
  const accessToken = localStorage.getItem("auth._token.local");
  return axios
    .post(`/reservation-svc/${token}`, data, {
      headers: {
        ...(accessToken && { Authorization: accessToken }),
      },
    })
    .then((res) => res.data);
};

export const getReservation = async (token, data) => {
  return axios
    .get(`/cart-svc/${token}/reservation`, data)
    .then((res) => res.data);
};
