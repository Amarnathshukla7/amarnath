module.exports = {
  devServer: {
    proxy: {
      "/search-svc/": {
        target:
          "https://beds-and-bars-search-subdomain-search-svc.bnb-platform.com/",
        pathRewrite: { "^/search-svc/": "" },
      },
      "/review-svc/": {
        target:
          "https://beds-and-bars-feedback-subdomain-review-service.bnb-platform.com/",
        pathRewrite: { "^/review-svc/": "" },
      },
      // "/cart-svc/": {
      //   target: "https://apis.bedsandbars.com/book/carts/",
      //   pathRewrite: { "^/cart-svc/": "" },
      // },
      // "/reservation-svc/": {
      //   target: "https://apis.bedsandbars.com/book/reservations/",
      //   pathRewrite: { "^/reservation-svc/": "" },
      // },
      // "/hostel-svc/": {
      //   target: "https://apis.bedsandbars.com/book/hostels/",
      //   pathRewrite: { "^/hostel-svc/": "" },
      // },
      // "/transaction-svc/": {
      //   target: "https://apis.bedsandbars.com/book/transactions/",
      //   pathRewrite: { "^/transaction-svc/": "" },
      // },
      "/cart-svc/": {
        target: "http://127.0.0.1:8000/carts/",
        pathRewrite: { "^/cart-svc/": "" },
      },
      "/reservation-svc/": {
        target: "http://127.0.0.1:8000/reservations/",
        pathRewrite: { "^/reservation-svc/": "" },
      },
      "/hostel-svc/": {
        target: "http://127.0.0.1:8000/hostels/",
        pathRewrite: { "^/hostel-svc/": "" },
      },
      "/transaction-svc/": {
        target: "http://127.0.0.1:8000/transactions/",
        pathRewrite: { "^/transaction-svc/": "" },
      },
    },
  },
};
