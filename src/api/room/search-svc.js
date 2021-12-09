import axios from "axios";

export const availability = async (
  hostel,
  start,
  end,
  token,
  bookingSource,
) => {
  const accessToken = localStorage.getItem("auth._token.local");

  console.log("getting availability", {
    hostel,
    start,
    end,
    token,
    bookingSource,
  });

  return axios
    .get(
      `/search-svc/${hostel}/${start}/${end}?token=${token}&booking_source=${bookingSource}`,
      {
        headers: {
          ...(accessToken && { Authorization: accessToken }),
        },
      },
    )
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

export const getBreakfastPrice = async (breakfastCode, token) => {
  const resp = await axios.get(`/search-svc/cache/${token}`);

  try {
    return resp.data.availability.service[breakfastCode].price;
  } catch {
    return {
      error: true,
    };
  }
};
