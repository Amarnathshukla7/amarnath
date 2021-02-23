const defaultCurrencies = [
  {
    key: "GBP",
    value: "GBP - British Pound",
  },
  {
    key: "EUR",
    value: "EUR - Euro",
  },
  {
    key: "USD",
    value: "USD - US Dollar",
  },
  {
    key: "AUD",
    value: "AUD - Australian Dollar",
  },
  {
    key: "CAD",
    value: "CAD - Canadian Dollar",
  },
];

const pragueCurrency = {
  key: "CZK",
  value: "CZK - Czech Koruna",
};

const cphCurrency = {
  key: "DKK",
  value: "DKK - Danish Krone",
};

export const getCurrencies = (hostelCode) => {
  if (hostelCode === "PRA") {
    return [pragueCurrency, ...defaultCurrencies];
  }

  if (hostelCode === "COP") {
    return [cphCurrency, ...defaultCurrencies];
  }

  return defaultCurrencies;
};
