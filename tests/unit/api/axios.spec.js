const axiosClient = require("../../../src/api/axios");

test("searchClient call should throw expection when env variable VUE_APP_SEARCH_SVC_URL is not set", () => {
  expect(() => {
    axiosClient.searchClient();
  }).toThrow(
    new Error("The VUE_APP_SEARCH_SVC_URL envrionment variable is required"),
  );
});

test("searchClient should assing env variable VUE_APP_SEARCH_SVC_URL to axios client", () => {
  process.env.VUE_APP_SEARCH_SVC_URL = "http://service.com/api";
  searchClient = axiosClient.searchClient();
  expect(searchClient).toBeTruthy();
  expect(searchClient.defaults.baseURL).toEqual("http://service.com/api");
});

test("reservationClient call should throw expection when env variable VUE_APP_RESERVATION_SVC_URL is not set", () => {
  expect(() => {
    axiosClient.reservationClient();
  }).toThrow(
    new Error(
      "The VUE_APP_RESERVATION_SVC_URL envrionment variable is required",
    ),
  );
});

test("reservationClient should assing env variable VUE_APP_RESERVATION_SVC_URL to axios client", () => {
  process.env.VUE_APP_RESERVATION_SVC_URL = "https://another-service.com/api";
  reservationClient = axiosClient.reservationClient();
  expect(reservationClient).toBeTruthy();
  expect(reservationClient.defaults.baseURL).toEqual(
    "https://another-service.com/api",
  );
});
