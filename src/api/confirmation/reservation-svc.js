import { reservationClient } from "../axios";

export const get = async (vm, ref) => {
  return reservationClient(vm)
    .get(`/transactions/${ref}`)
    .then((res) => res.data);
};
