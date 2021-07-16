// const fs = require("fs");

module.exports = {
  devServer: {
    proxy: {
      "/search-svc/": {
        target: "https://search-svc-labmweueeq-nw.a.run.app/",
        pathRewrite: { "^/search-svc/": "" },
      },
      "/review-svc/": {
        target: "https://feedback.svc.bedsandbars.com/",
        pathRewrite: { "^/review-svc/": "" },
      },
      "/cart-svc/": {
        target: "https://reservation.bnb-platform.com/api/carts/",
        pathRewrite: { "^/cart-svc/": "" },
      },
      "/reservation-svc/": {
        target: "https://reservation.bnb-platform.com/api/reservations/",
        pathRewrite: { "^/reservation-svc/": "" },
      },
      "/hostel-svc/": {
        target: "https://reservation.bnb-platform.com/api/hostels/",
        pathRewrite: { "^/hostel-svc/": "" },
      },
      "/transaction-svc/": {
        target: "https://reservation.bnb-platform.com/api/transactions/",
        pathRewrite: { "^/transaction-svc/": "" },
      },
      "/status-svc/": {
        target: "https://reservation.bnb-platform.com/api/status",
        pathRewrite: { "^/status-svc/": "" },
      },
    },
  },
};
