// https://docs.cypress.io/api/introduction/api.html
import { set as idbSet, del as idbDelete } from "idb-keyval";
import reservationJson from "../../fixtures/reservation-svc/token.json";

describe("Confirmation.vue", () => {

  beforeEach(() => {
    idbDelete('reservation');
  });

  it("should render confirmation", () => {

    idbSet('reservation', reservationJson);
    
    cy.visit("/confirmation");

    cy.contains('Your booking reference number is:').should('be.visible');
    cy.contains('TEST-STC-BRI-39896448').should('be.visible');
  })

  //it should not render when there is no reservation given
  // - It should show a message or redirect user
});
