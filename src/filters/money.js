export const formatPrice = (value, currency = "EUR") => {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency,
  }).format(value / 100);
};
