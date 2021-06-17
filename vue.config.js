// const fs = require("fs");

module.exports = {
  devServer: {
    proxy: {
      "/search-svc/": {
        // target: "https://search.svc.bedsandbars.com/",
        target: "https://search-svc-labmweueeq-nw.a.run.app/",
        pathRewrite: { "^/search-svc/": "" },
      },
      "/review-svc/": {
        // target: "https://feedback.svc.bedsandbars.com/",
        target: "https://feedback-svc-labmweueeq-nw.a.run.app/",
        pathRewrite: { "^/review-svc/": "" },
      },
      "/cart-svc/": {
        target: "https://reservation.bnb-platform.com/api/carts/",
        pathRewrite: { "^/cart-svc/": "" },
      },
      "/reservation-svc/": {
        // target: "http://reservation.svc.bedsandbars.com/api/reservations/",
        target: "https://reservation.bnb-platform.com/api/reservations/",
        pathRewrite: { "^/reservation-svc/": "" },
      },
      "/hostel-svc/": {
        // target: "http://reservation.svc.bedsandbars.com/api/hostels/",
        target: "https://reservation.bnb-platform.com/api/hostels/",
        pathRewrite: { "^/hostel-svc/": "" },
      },
      "/transaction-svc/": {
        // target: "http://reservation.svc.bedsandbars.com/api/transactions/",
        target: "https://reservation.bnb-platform.com/api/transactions",
        pathRewrite: { "^/transaction-svc/": "" },
      },
      "/status-svc/": {
        // target: "http://reservation.svc.bedsandbars.com/api/status",
        target: "https://reservation.bnb-platform.com/api/status",
        pathRewrite: { "^/status-svc/": "" },
      },
    },
  },
};
