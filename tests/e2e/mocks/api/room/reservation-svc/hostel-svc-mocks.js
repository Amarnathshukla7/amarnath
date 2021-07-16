export const find = (code) => {
  cy.route({
    method: "GET",
    url: `/hostel-svc/${code}`,
    response,
  }).as('getHostel');
};
  
