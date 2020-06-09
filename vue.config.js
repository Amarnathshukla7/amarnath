// const fs = require("fs");

module.exports = {
  devServer: {
    proxy: {
      "/search-svc/": {
        target: "https://search.svc.bedsandbars.com/",
        pathRewrite: { "^/search-svc/": "" },
      },
      "/review-svc/": {
        target: "https://feedback.svc.bedsandbars.com/",
        pathRewrite: { "^/review-svc/": "" },
      },
      "/cart-svc/": {
        target: "https://reservation.stage.svc.bedsandbars.com/api/carts/",
        pathRewrite: { "^/cart-svc/": "" },
      },
      "/reservation-svc/": {
        target:
          "https://reservation.stage.svc.bedsandbars.com/api/reservations/",
        pathRewrite: { "^/reservation-svc/": "" },
      },
      "/hostel-svc/": {
        target: "https://reservation.stage.svc.bedsandbars.com/api/hostels/",
        pathRewrite: { "^/hostel-svc/": "" },
      },
      "/transaction-svc/": {
        target:
          "https://reservation.stage.svc.bedsandbars.com/api/transactions/",
        pathRewrite: { "^/transaction-svc/": "" },
      },
    },
  },
};
