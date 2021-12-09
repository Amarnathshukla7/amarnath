// https://docs.cypress.io/api/introduction/api.html
import statusJson from "../fixtures/status-svc/not-upgrading.json";
import searchJson from "../fixtures/search-svc/BRI/2021-08-02/2021-08-05.json";
import contetfulHostelJson from "../fixtures/contentful/spaces/wqkd101r9z5s/environments/master/entries/hostel.json";
import hostelJson from "../fixtures/hostel-svc/api/bri.json";
import cartItemsJson from "../fixtures/reservation-svc/api/carts/ydu67i6789yo8re57u6_test/items.json";
import cartItemsDeletedJson from "../fixtures/reservation-svc/api/carts/ydu67i6789yo8re57u6_test/delete_item.json";

describe("Rooms.vue", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      "search-svc/BRI/2021-08-02/2021-08-05?token=ydu67i6789yo8re57u6_test",
      searchJson,
    );

    cy.intercept("GET', '/cart-svc/ydu67i6789yo8re57u6_test", cartItemsJson);

    cy.intercept(
      "GET",
      "https://cdn.contentful.com/spaces/wqkd101r9z5s/environments/master/entries?include=1&locale=en-GB&content_type=hostel&fields.code=BRI&select=fields.currency%2Cfields.rooms%2Cfields.code%2Cfields.shortName%2Cfields.streetAddress%2Cfields.gallery%2Cfields.title%2Cfields.mainImage%2Cfields.whatToKnow%2Cfields.extras%2Csys",
      contetfulHostelJson,
    );

    cy.intercept("GET", "status-svc", statusJson);

    cy.intercept("GET", "hostel-svc/BRI", hostelJson);
    cy.intercept(
      "POST",
      "cart-svc/ydu67i6789yo8re57u6_test/items",
      cartItemsJson,
    );
    cy.intercept(
      "GET",
      "cart-svc/ydu67i6789yo8re57u6_test/items",
      cartItemsJson,
    );

    cy.intercept(
      "DELETE",
      "cart-svc/ydu67i6789yo8re57u6_test/items/1000270",
      cartItemsDeletedJson,
    );
    cy.intercept(
      "DELETE",
      "cart-svc/ydu67i6789yo8re57u6_test/items/1000274",
      cartItemsDeletedJson,
    );

    cy.intercept(
      "DELETE",
      "cart-svc/ydu67i6789yo8re57u6_test/items/1000274/2021-08-02",
      cartItemsDeletedJson,
    );
    cy.intercept(
      "DELETE",
      "cart-svc/ydu67i6789yo8re57u6_test/items/1000274/2021-08-03",
      cartItemsDeletedJson,
    );
    cy.intercept(
      "DELETE",
      "cart-svc/ydu67i6789yo8re57u6_test/items/1000274/2021-08-04",
      cartItemsDeletedJson,
    );

    cy.intercept(
      "DELETE",
      "cart-svc/ydu67i6789yo8re57u6_test/items/1000270/2021-08-02",
      cartItemsDeletedJson,
    );
    cy.intercept(
      "DELETE",
      "cart-svc/ydu67i6789yo8re57u6_test/items/1000270/2021-08-03",
      cartItemsDeletedJson,
    );
    cy.intercept(
      "DELETE",
      "cart-svc/ydu67i6789yo8re57u6_test/items/1000270/2021-08-04",
      cartItemsDeletedJson,
    );
  });

  describe("Given no cid in URL query", () => {
    it("should append cid to URL query ", () => {
      cy.visit("/availability");
      cy.url().should("include", "?cid=");
    });
  });

  describe("Given the URL already has cid", () => {
    it("should not replace the cid", () => {
      cy.visit("availability/?cid=ydu67i6789yo8re57u6_test");
      cy.url().should("include", "cid=ydu67i6789yo8re57u6_test");
    });

    it("should render availability", () => {
      cy.visit("availability/?cid=ydu67i6789yo8re57u6_test");
      cy.contains("Private Rooms");
      cy.contains("Private 3-Bedroom Ensuite");
      cy.contains("£140.00");
    });
  });

  // describe("Given network error', () => {
  // it("should display error overlay', () => {
  //   cy.visit("availability");
  //   cy.contains("Network Error").should("be.visible');
  //   cy.contains("There seems to be a network error, please try again shortly.").should("be.visible');
  // });

  // it("should display error overlay', () => {
  //     cy.visit("availability");
  //     cy.contains("Network Error").should("be.visible');
  //     cy.contains("There seems to be a network error, please try again shortly.").should("be.visible');
  // });
  // });
});
