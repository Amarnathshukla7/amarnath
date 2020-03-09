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
        target: "https://search.apis.bedsandbars.com/",
        pathRewrite: { "^/search-svc/": "" },
      },
      "/review-svc/": {
        target:
          "https://beds-and-bars-feedback-subdomain-review-service.bnb-platform.com/",
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
        target: "https://reservations.stage.apis.bedsandbars.com/api/carts/",
        pathRewrite: { "^/cart-svc/": "" },
      },
      "/reservation-svc/": {
        target: "https://reservations.stage.apis.bedsandbars.com/api/reservations/",
        pathRewrite: { "^/reservation-svc/": "" },
      },
      "/hostel-svc/": {
        target: "https://reservations.stage.apis.bedsandbars.com/api/hostels/",
        pathRewrite: { "^/hostel-svc/": "" },
      },
      "/transaction-svc/": {
        target: "https://reservations.stage.apis.bedsandbars.com/api/transactions/",
        pathRewrite: { "^/transaction-svc/": "" },
      },
    },
  },
};
