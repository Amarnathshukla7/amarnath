// https://docs.cypress.io/api/introduction/api.html
import { set as idbSet, get as idbGet, del as idbDel } from "idb-keyval";
import hostelJson from "../fixtures/hostel-svc/api/bri.json";
import statusJson from "../fixtures/status-svc/not-upgrading.json";
import itemsJson from "../fixtures/reservation-svc/api/carts/ydu67i6789yo8re57u6_test/items.json";
import contetfulHostelJson from "../fixtures/contentful/spaces/wqkd101r9z5s/environments/master/entries/hostel.json";
import stripeTokenCreate from "../fixtures/stripe/api/v1/tokens.json";

describe("Transaction.vue", () => {
  beforeEach(() => {
    // Clearing the local storage to mock.
    cy.clearLocalStorage();

    cy.intercept(
      "GET",
      "https://cdn.contentful.com/spaces/wqkd101r9z5s/environments/master/entries?include=1&locale=en-GB&content_type=hostel&fields.code=BRI&select=fields.currency%2Cfields.rooms%2Cfields.code%2Cfields.shortName%2Cfields.streetAddress%2Cfields.gallery%2Cfields.title%2Cfields.mainImage%2Cfields.whatToKnow%2Cfields.extras%2Csys",
      contetfulHostelJson,
    );

    cy.intercept("GET", "status-svc", statusJson);
    cy.intercept("GET", "hostel-svc/BRI", hostelJson);

    /** Setting Cart to indexedDB local storage */
    idbSet("cart.ydu67i6789yo8re57u6_test", itemsJson);
  });

  describe("Given no cid in URL query", () => {
    it("should redirect to availability", () => {
      cy.visit("/payment");
      cy.url().should("include", Cypress.config().baseUrl + "availability");
    });
  });

  describe("Given valid cid in URL query", () => {
    it("should validate gues details", () => {
      cy.visit("/payment?cid=ydu67i6789yo8re57u6_test");

      /**  Filling guest details */
      cy.contains("1/3 Main Guest Details");
      cy.get("#input-27").focus();
      cy.get("#input-30").focus();
      cy.get("#input-33").focus();
    });

    it("should render the transaction page", () => {
      cy.intercept("POST", "https://r.stripe.com/0", {});
      cy.intercept("POST", "https://m.stripe.com/6", {});

      // Stub a response to PUT comments/ ****
      cy.intercept("POST", "https://api.stripe.com/v1/tokens", (req) => {
        req.reply({
          statusCode: 200,
          body: stripeTokenCreate,
        });
      });

      cy.visit("/payment?cid=ydu67i6789yo8re57u6_test");

      /**  Filling guest details */
      cy.contains("1/3 Main Guest Details");
      cy.get("#input-27").type("John Smith");
      cy.get("#input-30").type("tech+john.smit@bedsandbars.com");
      cy.get("#input-33").type("078987655212");
      /**
       * Selecting United Kingdom
       */
      cy.get("#input-36").type("United Kingdom");
      cy.get("#list-item-127-0").click();

      /** Filling payment details. **/
      // Selecting stripe
      cy.get(".v-input--radio-group__input > .row > :nth-child(1)").click();
      // Click on paynow
      cy.get(
        ".v-input--radio-group__input > .v-item--active > .v-label",
      ).click();

      cy.get(".__PrivateStripeElement > iframe").then(($elements) => {
        // $elements result set is the iframes for credit, expiry.
        // type into the first element:
        const creditInput = $elements
          .eq(0)
          .contents()
          .find("input[data-elements-stable-field-name=cardNumber]");
        cy.wrap(creditInput).type("424242424242424212/50");

        // type into the cvc element.
        const cvcInput = $elements
          .eq(0)
          .contents()
          .find("input[data-elements-stable-field-name=cardCvc]");
        cy.wrap(cvcInput).type("12312345");
      });

      cy.get(
        ":nth-child(1) > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple",
      ).click();
      cy.get(
        ":nth-child(2) > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple",
      ).click();
      cy.get("#pay-method-btn").click();

      cy.url().should("include", Cypress.config().baseUrl + "confirmation");
    });
  });
});
