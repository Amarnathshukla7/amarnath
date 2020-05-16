const priceLow = (availability) => {
  const method = (a, b) => {
    return a.avgRoomPrice - b.avgRoomPrice;
  };

  return {
    dorms: availability.dorms.sort(method),
    privates: availability.privates.sort(method),
  };
};

const priceHigh = (availability) => {
  const method = (a, b) => {
    return b.avgRoomPrice - a.avgRoomPrice;
  };

  return {
    dorms: availability.dorms.sort(method),
    privates: availability.privates.sort(method),
  };
};

const availLow = (availability) => {
  const method = (a, b) => {
    return Object.keys(a.dates).length - Object.keys(b.dates).length;
  };

  return {
    dorms: availability.dorms.sort(method),
    privates: availability.privates.sort(method),
  };
};

const availHigh = (availability) => {
  const method = (a, b) => {
    return Object.keys(b.dates).length - Object.keys(a.dates).length;
  };

  return {
    dorms: availability.dorms.sort(method),
    privates: availability.privates.sort(method),
  };
};

export default {
  "price-low": priceLow,
  "price-high": priceHigh,
  "avail-low": availLow,
  "avail-high": availHigh,
};
