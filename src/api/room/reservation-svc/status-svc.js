import axios from "axios";

export const getStatus = async (code) =>
  axios.get(`/status-svc/`).then(async (res) => {
    return res.data;
  });
