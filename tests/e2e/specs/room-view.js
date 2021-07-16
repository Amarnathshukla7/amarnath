// https://docs.cypress.io/api/introduction/api.html

describe("Rooms.vue", () => {

  beforeEach(() => {
    cy.server();
  });

  it("should load hostel details", () => {
    cy.get('@post').its('request.body').should('deep.equal', {
      title: 'example post',
      body: 'this is a post sent to the server',
      userId: 1,
    })
  });

  describe('Given no cid in URL query', () => {
    it("should append cid to URL query ", () => {
      cy.visit("/");
      cy.url().should('include', '?cid=')
    });
  });

  describe('Given the URL already has cid', () => {
    it("should not replace the cid.", () => {
      cy.visit("?cid=dtuio8y9p7ot86i7udr");
      cy.url().should('include', '?cid=dtuio8y9p7ot86i7udr')
    });
  });

  describe('Given network error', () => {
    it('should display error overlay', () => {
      cy.visit("/");
      cy.contains("Network Error").should('be.visible');
      cy.contains("There seems to be a network error, please try again shortly.").should('be.visible');
    });

    it('should display error overlay', () => {
        cy.visit("/");
        cy.contains("Network Error").should('be.visible');
        cy.contains("There seems to be a network error, please try again shortly.").should('be.visible');
    });
  });
});
