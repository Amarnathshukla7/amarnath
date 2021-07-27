import { render } from "@testing-library/vue";
import { get } from "idb-keyval";
import { track } from "@/helpers/transaction/tracking"
import Confirmation from "@/views/Confirmation.vue";
import { stcSpaceClient, fpSpaceClient } from "@/plugins/contentful";
import reservationJson from "../../e2e/fixtures/reservation-svc/token.json";
import bookingJourneyJson from "../../e2e/fixtures/contentful/spaces/uld4p9k0kh49/environments/master/entries/bookingEngineUi.json"
import hostelDataJson from "../../e2e/fixtures/contentful/spaces/wqkd101r9z5s/environments/master/entries/hostel.json";
import store from "@/store";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);
jest.mock("idb-keyval");
jest.mock("@/helpers/transaction/tracking");
jest.mock("@/plugins/contentful");

const renderWithVuetify = (component, options, callback) => {
  const root = document.createElement('div')
  root.setAttribute('data-app', 'true')

  return render(
    component,
    {
      container: document.body.appendChild(root),
      // for Vuetify components that use the $vuetify instance property
      vuetify: new Vuetify(),
      ...options,
    },
    callback,
  );
};

describe("Confirmation.vue", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    get.mockImplementation((key) => {
      return reservationJson;
    });

    track.mockImplementation();

    stcSpaceClient.mockImplementation(() => {
      console.warn({ fpSpaceClient: "fpSpaceClient.mockImplementation" });
      return {
        getEntries: () => new Promise((resolve) => {
            resolve({ data: hostelDataJson });
          })
      };
    });

    fpSpaceClient.mockImplementation(() => {
      console.warn({ fpSpaceClient: "fpSpaceClient.mockImplementation" });
      return {
        getEntries: () => new Promise((resolve) => {
            resolve({ data: bookingJourneyJson });
          })
      };
    });
  });

  it.only("should render confirmation view", () => {
    const { html } = renderWithVuetify(Confirmation, {store});
  });

  describe("Google Tag Manager", () => {
    it("should track reservation", async () => {

      renderWithVuetify(Confirmation, {store});
      expect(track).toHaveBeenCalledTimes(1);
    });
  });
});
