export const availability = async (response, hostel, start, end, token) => {
  const accessToken = localStorage.getItem("auth._token.local");

  console.log('getAvailability', { hostel, start, end, token});
  
  cy.route({
    method: "POST",
    url: `/search-svc/${hostel}/${start}/${end}?token=${token}`,
    headers: {
      ...(accessToken && { Authorization: accessToken }),
    },
    response,
  }).as('getAvailability');
};

export const getBreakfastPrice = async (response, breakfastCode, token) => {
  cy.route({
    method: "GET",
    url: `/search-svc/cache/${token}`,
    response,
  }).as('getBreakfastPrice');
};
