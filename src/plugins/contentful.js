import { createClient } from "contentful";
// import { create } from "core-js/fn/object";

const stcSpaceClient = () => {
  return createClient({
    space: "wqkd101r9z5s",
    accessToken:
      "d8b7eae1d7539b767234de8ba4a4ca1798071e925fab125d20c1905eb94b9952",
  });
};

const fpSpaceClient = () => {
  return createClient({
    space: "uld4p9k0kh49",
    accessToken: "bRsK9B6bnvgj8QkoIu5hKLkftNDSuFqN8rp_ccuH6Vs",
  });
};

export { stcSpaceClient, fpSpaceClient };
