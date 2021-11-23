import { resrvationClient } from "../../axios";

export const find = async (code) =>
  resrvationClient.get(`/hostels/${code}`).then(async (res) => {
    return res.data;
  });
