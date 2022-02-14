import CommonViewOptions from "../config/common-view-options";

let options = {
  currentStepKey: "transaction",
  relativePath: "/payment",
  guestDetailsFormComponent: "basic",
  /**
   * Enable or Disable digital wallets, apple pay and google pay globally.
   */
  digitalWalletEnabled: true,
  /**
   * canApplyCouponCode:
   * Enabled by default when set to false.
   * The coupon apply form will be hidden and the booking summary will not display the Loyalty Coupon Code.
   */
  canApplyCouponCode: false,
  /**
   * canMarketingOptin allow us to disable customer sign up for marketing when paying.
   */
  canOptInForMarketingNewsletter: false,
  /**
   * Option enabled for agent direct to allow o send email to customer.
   */
  canSendConfirmationEmailToCustomer: false,
  /**
   * Supported currencies for all gateways.
   */
  supportedCurrencies: [
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
  ],
  /**
   * List of gateways with configrations
   */
  gateways: [
    {
      key: "card",
      /**
       * Stripe is enabled by default if disabled stripe will not be disabled on the payment form.
       */
      enabled: true,
      /**
       * The img src is used as radio button to display payment option.
       */
      imgSrc:
        "https://storage.googleapis.com/bedsandbars-images/card-icons1.02fa28e9.svg",
      /**
       * Supported DigitalWallets is displayed when the browser supports them. All enabled by default
       * specific wallets can be disabled.
       */
      supportedDigitalWallets: [
        {
          key: "applePay",
          imgSrc:
            "https://storage.googleapis.com/bedsandbars-images/card-icons1.02fa28e9.svg",
          enabled: true,
          conditions: () =>
            /Chrome/.test(navigator.userAgent) &&
            /Google Inc/.test(navigator.vendor),
        },
        {
          key: "googlePay",
          imgSrc:
            "https://storage.googleapis.com/bedsandbars-images/paypal-icon.580dc673.svg",
          enabled: true,
          conditions: () =>
            /Safari/.test(navigator.userAgent) &&
            /Apple Computer, Inc./.test(navigator.vendor),
        },
      ],
      /**
       * Deposit options, the customers can pay on arrivial and now.
       * The reservations api has the deposit_model_rate which is returned with the cart.
       * This is used to make sure right deposit models are displat to customer.
       *
       * The deposit_model_rate is to compare against the deposit value. The deposit option value must be equal or greater than
       * the deposit_model_rate to make below configured options visible.
       */
      depositOptions: [
        {
          enabled: false,
          value: 0,
          key: "payOnArrival",
          displayText: "Pay on Arrivial",
        },
        {
          enabled: true,
          value: 100,
          key: "payNow",
          displayText: "Pay now",
        },
      ],
    },
    /**
     * Some hostels don't support paypal, when we pull hostel details from reservation API we also receive the paypal option for the hostel,
     * If the hostel has paypal disabled the defaults will be overwriten with hostels configration.
     */
    {
      key: "paypal",
      enabled: false,
      imgSrc:
        "https://storage.googleapis.com/bedsandbars-images/paypal-icon.580dc673.svg",
      supportedDigitalWallets: [],
      /**
       * Customers can only pay now.
       * The value property of the deposit option presents the value of the booking.
       * If the total amount of deposit £200.00, value 15 equals to £30. Value 0 is used for pay on arrivial
       * the customer will pay when checking-in at the hostel desk or pre-arrival.
       */
      depositOptions: [
        {
          enabled: false,
          value: 0,
          key: "payOnArrival",
        },
        {
          enabled: true,
          value: 100,
          key: "payNow",
        },
      ],
    },
  ],
};

/**
 * Merging in the default comon view options.
 * If the common view needs be overiden place in options.
 *
 * e.g. showSteps: false wont be displayed in transactions view if set to false.
 */
options = {
  ...CommonViewOptions,
  ...options,
};

export default options;
