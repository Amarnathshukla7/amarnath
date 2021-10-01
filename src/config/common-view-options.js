export default {
  /**
   * Default value for the current step.
   */
  currentStep: 'rooms',
  steps: [
    {
      name: 'rooms',
      displayText: 'Availability',
    },
    {
      name: 'transaction',
      displayText: 'Payment',
    },
    {
      name: 'confirmation',
      displayText: 'Confirmation',
    }
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
   relativePath: '/',
}