export default {
  /**
   * Default value for the current step.
   */
  currentStepKey: "search",
  canShowSearchWidget: true,
  getSteps: () => {
    return this.steps.filter((step) => step.enabled);
  },
  steps: [
    {
      enabled: true,
      key: "search",
      displayText: "Search",
      canVisit: true,
    },
    {
      enabled: true,
      key: "rooms",
      displayText: "Availability",
      canVisit: true,
    },
    {
      enabled: true,
      key: "transaction",
      displayText: "Payment",
      canVisit: true,
    },
    {
      enabled: true,
      key: "confirmation",
      displayText: "Confirmation",
      canVisit: true,
    },
  ],
  /**
   * Show steps built steps/breadcrumbs steps.
   * e.g.
   */
  showSteps: true,
  /**
   * Default route path for specific pages, this is here only for reference.
   * Please overide this value with the path the application has.
   */
  relativePath: "/",
};
