import TransactionViewOptions from "../config/transaction-view-options";

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
    return [pragueCurrency, ...TransactionViewOptions.supportedCurrencies];
  }

  if (hostelCode === "COP") {
    return [cphCurrency, ...TransactionViewOptions.supportedCurrencies];
  }

  return TransactionViewOptions.supportedCurrencies;
};
