import axios from "axios";
import { resrvationClient } from "../axios";

export const get = async (ref) => {
  return resrvationClient.get(`/transactions/${ref}`).then((res) => res.data);
};
