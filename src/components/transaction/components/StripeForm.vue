<template>
  <div>
    <v-stripe-card
      class="stripe_form--field mt-4"
      v-if="stripeReady"
      ref="stripeCard"
      :api-key="stripeKey"
      outlined
      tile
      @ready="createPaymentRequest"
    ></v-stripe-card>

    <div id="payment-request-button">
      <!-- A Stripe Element will be inserted here. -->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueLoadScript from "vue-load-script-plus";
import { create } from "../api/transaction-svc";

Vue.use(VueLoadScript);

export default {
  props: {
    deposit: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      stripeReady: false,
      stripeKey: "pk_test_m0eFJAIVQpT7S1OKH6YvkjlZ",
      paymentRequest: null,
    };
  },
  mounted() {
    this.loadScript();
  },
  methods: {
    loadScript() {
      this.$loadScript("https://js.stripe.com/v3/").then(() => {
        this.stripeReady = true;
      });
    },
    createPaymentRequest() {
      this.paymentRequest = this.$refs.stripeCard.stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Demo total",
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      console.log(this.$refs.stripeCard);

      const prButton = this.$refs.stripeCard.elements.create(
        "paymentRequestButton",
        {
          paymentRequest: this.paymentRequest,
        },
      );

      // Check the availability of the Payment Request API first.
      this.paymentRequest.canMakePayment().then(function(result) {
        console.log(result);
        if (result) {
          prButton.mount("#payment-request-button");
        } else {
          document.getElementById("payment-request-button").style.display =
            "none";
        }
      });
    },
    async createStripeReservation() {
      const transaction = await create("stripe", this.deposit);
      const secret = JSON.parse(transaction.secret_output)["secret"];

      const data = {
        payment_method: {
          card: this.$refs.stripeCard.card,
        },
      };

      const type = this.deposit === 0 ? "setupIntent" : "paymentIntent";

      const intent =
        this.deposit === 0
          ? this.$refs.stripeCard.stripe.confirmCardSetup(secret, data)
          : this.$refs.stripeCard.stripe.confirmCardPayment(secret, data);

      return intent.then(res => res[type]);
    },
  },
};
</script>

<style scoped>
.stripe_form--field {
  max-width: 380px;
}
</style>
