import { reservationClient } from "../axios";

export const create = async (vm, token, gateway, deposit = 100, currency) => {
  return reservationClient(vm)
    .post(`/transactions/${token}`, {
      gateway,
      deposit,
      currency,
    })
    .then((res) => res.data);
};
