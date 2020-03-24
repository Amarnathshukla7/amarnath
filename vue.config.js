// const fs = require("fs");

module.exports = {
  devServer: {
    // public: "https://localhost:8080/",
    // https: {
    //   key: fs.readFileSync("./certs/localhost+2-key.pem"),
    //   cert: fs.readFileSync("./certs/localhost+2.pem"),
    // },
    proxy: {
      "/search-svc/": {
        target: "https://search.svc.bedsandbars.com/",
        pathRewrite: { "^/search-svc/": "" },
      },
      "/review-svc/": {
        target: "https://feedback.svc.bedsandbars.com/",
        pathRewrite: { "^/review-svc/": "" },
      },
      // "/cart-svc/": {
      //   target: "http://localhost:8000/carts/",
      //   pathRewrite: { "^/cart-svc/": "" },
      // },
      // "/reservation-svc/": {
      //   target: "http://localhost:8000/reservations/",
      //   pathRewrite: { "^/reservation-svc/": "" },
      // },
      // "/hostel-svc/": {
      //   target: "http://localhost:8000/hostels/",
      //   pathRewrite: { "^/hostel-svc/": "" },
      // },
      // "/transaction-svc/": {
      //   target: "http://localhost:8000/transactions/",
      //   pathRewrite: { "^/transaction-svc/": "" },
      // },
      "/cart-svc/": {
        target: "https://reservation.svc.bedsandbars.com/api/carts/",
        pathRewrite: { "^/cart-svc/": "" },
      },
      "/reservation-svc/": {
        target: "https://reservation.svc.bedsandbars.com/api/reservations/",
        pathRewrite: { "^/reservation-svc/": "" },
      },
      "/hostel-svc/": {
        target: "https://reservation.svc.bedsandbars.com/api/hostels/",
        pathRewrite: { "^/hostel-svc/": "" },
      },
      "/transaction-svc/": {
        target: "https://reservation.svc.bedsandbars.com/api/transactions/",
        pathRewrite: { "^/transaction-svc/": "" },
      },
    },
  },
};
