export default {
  /**
   * Default value for the current step.
   */
  currentStepKey: "search",
  /**
   * Using any navigation the go back button can be used to reset the current cart id.
   * and its also used for the step navigation to control page swtiches.
   */
  canGoBack: true,
  /**
   * The search widget can be enabled to display with in the booking journey views.
   */
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
      relativePath: "/search",
      keepQueryParams: true,
    },
    {
      enabled: true,
      key: "rooms",
      displayText: "Availability",
      canVisit: true,
      relativePath: "/availability",
      keepQueryParams: true,
    },
    {
      enabled: true,
      key: "transaction",
      displayText: "Payment",
      canVisit: true,
      relativePath: "/payment",
      keepQueryParams: true,
    },
    {
      enabled: true,
      key: "confirmation",
      displayText: "Confirmation",
      canVisit: true,
      relativePath: "/conformation",
      keepQueryParams: true,
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
