module.exports = {
  devServer: {
    proxy: {
      "/search-svc/": {
        target: "http://localhost:5001/",
        pathRewrite: { "^/search-svc/": "" },
      },
      "/review-svc/": {
        target: "https://feedback.svc.bedsandbars.com/",
        pathRewrite: { "^/review-svc/": "" },
      },
      "/cart-svc/": {
        target: "http://reservation-apis.loc/api/carts/",
        pathRewrite: { "^/cart-svc/": "" },
      },
      "/reservation-svc/": {
        target: "http://reservation-apis.loc/api/reservations/",
        pathRewrite: { "^/reservation-svc/": "" },
      },
      "/hostel-svc/": {
        target: "http://reservation-apis.loc/api/hostels/",
        pathRewrite: { "^/hostel-svc/": "" },
      },
      "/transaction-svc/": {
        target: "http://reservation-apis.loc/api/transactions/",
        pathRewrite: { "^/transaction-svc/": "" },
      },
      "/status-svc/": {
        target: "http://reservation-apis.loc/api/status",
        pathRewrite: { "^/status-svc/": "" },
      },
    },
  },
};
