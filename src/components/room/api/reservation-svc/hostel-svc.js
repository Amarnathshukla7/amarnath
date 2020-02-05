import axios from "axios";

export const find = async code =>
  axios.get(`/hostel-svc/${code}`).then(res => res.data);
