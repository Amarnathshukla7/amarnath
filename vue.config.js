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
      "/cart-svc/": {
        target: "http://localhost:8000/carts/",
        pathRewrite: { "^/cart-svc/": "" },
      },
      "/reservation-svc/": {
        target: "http://localhost:8000/reservations/",
        pathRewrite: { "^/reservation-svc/": "" },
      },
      "/hostel-svc/": {
        target: "http://localhost:8000/hostels/",
        pathRewrite: { "^/hostel-svc/": "" },
      },
    },
  },
};
