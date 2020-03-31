<template>
  <v-stripe-card
    class="stripe_form--field mt-4"
    v-if="stripeReady"
    ref="stripeCard"
    :api-key="stripeKey"
    outlined
    tile
  ></v-stripe-card>
</template>

<script>
import Vue from "vue";
import VueLoadScript from "vue-load-script-plus";
import { create } from "../api/transaction-svc";
import { getStripeKey } from "../helpers/stripe";

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
      stripeKey: null,
      paymentRequest: null,
    };
  },
  created() {
    this.stripeKey = getStripeKey();
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
    async createStripeTransaction() {
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
