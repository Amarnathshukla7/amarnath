import { resrvationClient } from "../../axios";

export const getStatus = async (code) =>
  resrvationClient.get(`/status`).then(async (res) => {
    return res.data;
  });
