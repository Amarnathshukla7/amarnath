import { reservationClient } from "../../axios";

export const find = async (vm, code) =>
  reservationClient(vm)
    .get(`/hostels/${code}`)
    .then(async (res) => {
      return res.data;
    });
