import axios from "axios";
import cryptoRandomString from "crypto-random-string";
import { set, get } from "idb-keyval";

const makeToken = async () => {
  const token = cryptoRandomString({ length: 30, type: "url-safe" });

  await set("token", {
    token,
  });

  return token;
};

export const availability = async (hostel, start, end) => {
  const token = await makeToken();
  const accessToken = localStorage.getItem("auth._token.local");

  return axios
    .get(`/search-svc/${hostel}/${start}/${end}?token=${token}`, {
      headers: {
        ...(accessToken && { Authorization: accessToken }),
      },
    })
    .then((res) => {
      try {
        const defaultPlanId = res.data.availability.default;
        const plan = res.data.availability.plans.find(
          (plan) => plan.planId === defaultPlanId,
        );

        return {
          minstays: plan.minstay,
          dorms: plan.rooms.filter((room) => room.roomType === "dorm"),
          privates: plan.rooms.filter((room) => room.roomType === "private"),
        };
      } catch (e) {
        return res.data;
      }
    });
};

export const getBreakfastPrice = async (breakfastCode) => {
  const { token } = await get("token");
  const resp = await axios.get(`/search-svc/cache/${token}`);

  try {
    return res.data.availability.service[breakfastCode].price;  
  } catch (error) { 
    return {
      error: true,
    };
  }
};
