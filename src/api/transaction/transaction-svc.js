import axios from "axios";

export const create = async (token, gateway, deposit = 100, currency) => {
  return axios
    .post(`/transaction-svc/${token}`, {
      gateway,
      deposit,
      currency,
    })
    .then((res) => res.data);
};
