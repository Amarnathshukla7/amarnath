import { reservationClient } from "../../axios";

export const getStatus = async (vm, code) =>
  reservationClient(vm)
    .get(`/status`)
    .then(async (res) => {
      return res.data;
    });
