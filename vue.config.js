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
        target: "http://reservation-apis.test/api/carts/",
        pathRewrite: { "^/cart-svc/": "" },
      },
      "/reservation-svc/": {
        target: "http://reservation-apis.test/api/reservations/",
        pathRewrite: { "^/reservation-svc/": "" },
      },
      "/hostel-svc/": {
        target: "http://reservation-apis.test/api/hostels/",
        pathRewrite: { "^/hostel-svc/": "" },
      },
      "/transaction-svc/": {
        target: "http://reservation-apis.test/api/transactions/",
        pathRewrite: { "^/transaction-svc/": "" },
      },
    },
  },
};
