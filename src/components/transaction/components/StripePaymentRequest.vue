<template>
  <div id="payment-request-button">
    <!-- A Stripe Element will be inserted here. -->
  </div>
</template>

<script>
import { create } from "../api/transaction-svc";
import { getStripeKey } from "../helpers/stripe";

export default {
  props: {
    formRef: {
      type: Object,
      default: null,
    },
    cart: {
      type: Object,
      default: null,
    },
    deposit: {
      type: Number,
      default: 100,
    },
    currency: {
      type: String,
      default: "eur",
    },
  },
  watch: {
    cart(cart) {
      this.paymentRequest.update({
        total: {
          label: "Total",
          amount: cart.total_cost,
        },
      });
    },
  },
  data() {
    return {
      Stripe: null,
      paymentRequest: null,
    };
  },
  mounted() {
    const stripeInt = setInterval(() => {
      if (window.Stripe) {
        this.init();
        clearInterval(stripeInt);
      }
    }, 500);
  },
  methods: {
    init() {
      this.Stripe = window.Stripe(getStripeKey());

      this.paymentRequest = this.Stripe.paymentRequest({
        country: "GB",
        currency: this.currency.toLowerCase(),
        total: {
          label: "Total",
          amount: this.cart.total_cost,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const elements = this.Stripe.elements();
      const prButton = elements.create("paymentRequestButton", {
        paymentRequest: this.paymentRequest,
      });

      // Check the availability of the Payment Request API first.
      this.paymentRequest.canMakePayment().then(result => {
        if (result) {
          this.$emit("wallet-enabled");

          prButton.on("click", event => {
            if (!this.formRef.validate()) {
              event.preventDefault();
              this.$emit("show-validation-error");
              return;
            }
          });

          prButton.mount("#payment-request-button");
        } else {
          document.getElementById("payment-request-button").style.display =
            "none";
        }
      });

      this.paymentRequest.on("paymentmethod", ev => {
        this.createStripePaymentRequest(ev);
      });
    },
    async createStripePaymentRequest(ev) {
      const transaction = await create("stripe", this.deposit);
      const secret = JSON.parse(transaction.secret_output)["secret"];

      this.Stripe.confirmCardPayment(
        secret,
        { payment_method: ev.paymentMethod.id },
        { handleActions: false },
      ).then(confirmResult => {
        if (confirmResult.error) {
          ev.complete("fail");
          this.$emit("preq-error");
        } else {
          ev.complete("success");
          this.Stripe.confirmCardPayment(secret).then(result => {
            if (result.error) {
              // The payment failed -- ask your customer for a new payment method.
              this.$emit("preq-error");
            } else {
              this.$emit("preq-approved", result.paymentIntent);
            }
          });
        }
      });

      // return intent.then(res => res[type]);
    },
  },
};
</script>

<style lang="scss" scoped>
#payment-request-button {
  max-width: 220px;
}
</style>
