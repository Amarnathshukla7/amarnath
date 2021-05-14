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
        target: "http://localhost/api/carts/",
        pathRewrite: { "^/cart-svc/": "" },
      },
      "/reservation-svc/": {
        target: "http://localhost/api/reservations/",
        pathRewrite: { "^/reservation-svc/": "" },
      },
      "/hostel-svc/": {
        target: "http://localhost/api/hostels/",
        pathRewrite: { "^/hostel-svc/": "" },
      },
      "/transaction-svc/": {
        target: "http://localhost/api/transactions/",
        pathRewrite: { "^/transaction-svc/": "" },
      },
      "/status-svc/": {
        target: "http://localhost/api/status",
        pathRewrite: { "^/status-svc/": "" },
      },
    },
  },
};
