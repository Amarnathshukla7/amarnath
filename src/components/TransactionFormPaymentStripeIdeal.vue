<template>
  <div id="payment-request-button">
    <!-- A Stripe Element will be inserted here. -->
  </div>
</template>

<script>
import Vue from "vue";
import VueLoadScript from "vue-load-script-plus";
import { getStripeKey } from "../../helpers/stripe";

Vue.use(VueLoadScript);
export default {
  props: {
    stripeKey: {
      type: String,
      default: null,
    },
  },
  mounted() {
    const stripeInt = setInterval(() => {
      if (window.Stripe) {
        this.init();
        clearInterval(stripeInt);
      }
    }, 500);
    // this.$loadScript("https://js.stripe.com/v3/").then(() => {
    //   console.log(window.Stripe);
    //   this.init();
    // });
  },
  methods: {
    init() {
      const Stripe = window.Stripe(this.stripeKey);

      this.paymentRequest = Stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Demo total",
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const elements = Stripe.elements();
      const prButton = elements.create("paymentRequestButton", {
        paymentRequest: this.paymentRequest,
      });

      // Check the availability of the Payment Request API first.
      this.paymentRequest.canMakePayment().then((result) => {
        if (result) {
          this.$emit("wallet-enabled");
          prButton.mount("#payment-request-button");
        } else {
          document.getElementById("payment-request-button").style.display =
            "none";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#payment-request-button {
  max-width: 220px;
}
</style>
