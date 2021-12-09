<template>
  <v-stripe-card
    class="stripe_form--field mt-2"
    v-if="stripeReady && stripeKey"
    ref="stripeCard"
    :api-key="stripeKey"
    outlined
    tile
  ></v-stripe-card>
</template>

<script>
import { create } from "../api/transaction/transaction-svc";
import { getStripeKey } from "../helpers/transaction/stripe";
import { mapGetters, maptGetters } from "vuex";

export default {
  props: {
    deposit: {
      type: Number,
      default: 0,
    },
    stripeKey: {
      type: String,
      default: null,
    },
    selectedCurrency: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      stripeReady: false,
      paymentRequest: null,
      rules: {
        card: [
          (v) =>
            !!v ||
            this.contentTransactionPaymentForm.other.stripe.rules.required,
        ],
      },
    };
  },
  mounted() {
    this.loadScript();
  },
  computed: {
    ...mapGetters("bookingEngine", ["contentTransactionPaymentForm"]),
  },
  methods: {
    loadScript() {
      const stripeInt = setInterval(() => {
        if (window.Stripe) {
          this.stripeReady = true;

          clearInterval(stripeInt);
        }
      }, 500);
    },
    async createStripeTransaction() {
      const transaction = await create(
        this,
        this.$route.query.cid,
        "stripe",
        this.deposit,
        this.selectedCurrency,
      );
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

      return intent.then((res) => res[type]);
    },
  },
};
</script>

<style scoped>
.stripe_form--field {
  max-width: 380px;
}
</style>
