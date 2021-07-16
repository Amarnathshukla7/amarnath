export const create = (response, source, token) => {
  cy.route({
    method: "POST",
    url: `/cart-svc/${token}`,
    response,
  }).as('createCart');
};

export const get = (response, token) => {
  cy.route({
      method: "GET",
      url: `/cart-svc/${token}`,
      response,
  }).as('getCart');
};

// export const updateOrCreate = (room, dates, token) => {
//   return axios
//     .post(`/cart-svc/${token}/items`, {
//       ...dates,
//     })
//     .then((res) => res.data);
// };

// export const destroy = (room, date, token) => {
//   const appendDate = date ? `/${date}` : "";

//   return axios
//     .delete(`/cart-svc/${token}/items/${room}${appendDate}`)
//     .then((res) => res.data);
// };
