import axios from "axios";

export const find = async (code) =>
  axios.get(`/hostel-svc/${code}`).then(async (res) => {
    return res.data;
  });
