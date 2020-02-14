import axios from "axios";
import { set } from "idb-keyval";

export const find = async code =>
  axios.get(`/hostel-svc/${code}`).then(async res => {
    await set("hostel-config", res.data);
    return res.data;
  });
