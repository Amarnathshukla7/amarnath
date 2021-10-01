import CommonViewOptions from '../config/common-view-options';

let options = {
  currentStep: 'transaction',
  relativePath: '/payment',
  /**
   * canApplyCouponCode:
   * Enabled by default when set to false.
   * The coupon apply form will be hidden and the booking summary will not display the Loyalty Coupon Code.
   */
  canApplyCouponCode: true,
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
  gateways: {
    card: {
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
      supportedDigitalWallets: {
        applePay: {
          imgSrc:
            "https://storage.googleapis.com/bedsandbars-images/card-icons1.02fa28e9.svg",
          enabled: true,
          conditions: () => /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
        },
        googlePay: {
          imgSrc:
            "https://storage.googleapis.com/bedsandbars-images/paypal-icon.580dc673.svg",
          enabled: true,
          conditions: () => /Safari/.test(navigator.userAgent) && /Apple Computer, Inc./.test(navigator.vendor)
        },
      },
      /**
       * Deposit options, the customers can pay on arrivial and now.
       */
      depositOptions: [
        {
          enabled: true,
          key: 'payOnArrival',
          displayText: '',
        },
        {
          enabled: true,
          key: 'payOnNow',
          displayText: '',
        },
      ],
    },
    /**
     * Some hostels don't support paypal, when we pull hostel details from reservation API we also receive the paypal option for the hostel,
     * If the hostel has paypal disabled the defaults will be overwriten with hostels configration.
     */
    paypal: {
      enabled: false,
      imgSrc:
        "https://storage.googleapis.com/bedsandbars-images/paypal-icon.580dc673.svg",
      supportedDigitalWallets: {
        applePay: {
          imgSrc:
            "https://storage.googleapis.com/bedsandbars-images/card-icons1.02fa28e9.svg",
          enabled: true,
        },
        googlePay: {
          imgSrc:
            "https://storage.googleapis.com/bedsandbars-images/paypal-icon.580dc673.svg",
          enabled: true,
        },
      },
      /**
       * Customers can only pay now. 
       */
      depositOptions: [
        {
          enabled: true,
          key: 'payOnArrival'
        },
        {
          enabled: true,
          key: 'payOnNow',
        },
      ],
    },
  },
};

/**
 * Merging in the default comon view options.
 * If the common view needs be overiden place in options.
 * 
 * e.g. showSteps: false wont be displayed in transactions view if set to false.
 */
options = {
  CommonViewOptions,
  ...options,
};


export default options;