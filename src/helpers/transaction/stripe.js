export const getStripeKey = () => {
  console.log(process.env.NODE_ENV);
  if (process.env.VUE_APP_MODE === "production") {
    return "pk_live_ZIg3OXpf5Pw23Ljd7QoxCUs700ZFnmIcjt";
  }

  return "pk_test_97WWfDjUOsVWAzm3y1g8t0BJ00F4iyqoge";
};
