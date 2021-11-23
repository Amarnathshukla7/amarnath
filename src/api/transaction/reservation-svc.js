import { resrvationClient } from "../axios";

export const create = async (token, data) => {
  const accessToken = localStorage.getItem("auth._token.local");
  return resrvationClient
    .post(`/reservations/${token}`, data, {
      headers: {
        ...(accessToken && { Authorization: accessToken }),
      },
    })
    .then((res) => res.data);
};
