import axios from "axios";
import { resrvationClient } from "../axios";

export const create = async (token, gateway, deposit = 100, currency) => {
  return resrvationClient
    .post(`/transactions/${token}`, {
      gateway,
      deposit,
      currency,
    })
    .then((res) => res.data);
};
