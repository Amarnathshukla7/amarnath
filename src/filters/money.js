export const formatPrice = (value, currency = "EUR") => {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency,
  }).format(value / 100);
};

export const convertCurrency = (value, rate = 1) => {
  const amount = value * rate;
  return Math.round(amount);
};
