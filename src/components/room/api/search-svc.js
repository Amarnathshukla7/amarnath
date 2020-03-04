import axios from "axios";
import nanoid from "nanoid";
import { set, get } from "idb-keyval";

const makeToken = async () => {
  const token = nanoid();

  await set("token", {
    token,
  });

  return get("token");
};

export const availability = async (hostel, start, end) => {
  const { token } = await makeToken();

  return axios
    .get(`/search-svc/${hostel}/${start}/${end}?token=${token}`)
    .then(res => {
      const defaultPlanId = res.data.availability.default;

      const plan = res.data.availability.plans.find(
        plan => plan.planId === defaultPlanId,
      );

      return {
        minstays: plan.minstay,
        dorms: plan.rooms.filter(room => room.roomType === "dorm"),
        privates: plan.rooms.filter(room => room.roomType === "private"),
      };
    });
};

export const getBreakfastPrice = async breakfastCode => {
  const { token } = await get("token");

  return axios.get(`/search-svc/cache/${token}`).then(res => {
    return res.data.availability.service[breakfastCode].price;
  });
};
