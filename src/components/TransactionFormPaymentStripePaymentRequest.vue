<template>
  <div class="pay-req-container">
    <div id="payment-request-button" class="mx-auto mb-4">
      <!-- A Stripe Element will be inserted here. -->
    </div>
    <div v-show="deposit === 0" class="caption px-5">
      {{ contentTransactionPaymentForm.other.stripe.authMsg }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { create } from "../api/transaction/transaction-svc";
import { getStripeKey } from "../helpers/transaction/stripe";

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
    stripeKey: {
      type: String,
      default: null,
    },
  },
  watch: {
    deposit(deposit) {
      this.paymentRequest.update({
        total: {
          label: "Total",
          amount: this.cart.total_cost * (deposit / 100),
        },
      });
    },
    cart(cart) {
      this.paymentRequest.update({
        total: {
          label: "Total",
          amount: cart.total_cost * (this.deposit / 100),
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
      this.Stripe = window.Stripe(this.stripeKey);

      this.paymentRequest = this.Stripe.paymentRequest({
        country: "GB",
        currency: this.currency.toLowerCase(),
        total: {
          label: "Total",
          amount: this.cart.total_cost * (this.deposit / 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const elements = this.Stripe.elements();
      const prButton = elements.create("paymentRequestButton", {
        paymentRequest: this.paymentRequest,
      });

      // Check the availability of the Payment Request API first.
      this.paymentRequest.canMakePayment().then((result) => {
        if (result) {
          this.$emit("wallet-enabled");

          prButton.on("click", (event) => {
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

      this.paymentRequest.on("paymentmethod", (ev) => {
        this.createStripePaymentRequest(ev);
      });
    },
    async createStripePaymentRequest(ev) {
      const transaction = await create(
        this,
        this.$route.query.cid,
        "stripe",
        this.deposit,
      );
      const secret = JSON.parse(transaction.secret_output)["secret"];

      const data = {
        payment_method: ev.paymentMethod.id,
      };

      const intent =
        this.deposit === 0
          ? this.Stripe.confirmCardSetup(secret, data)
          : this.Stripe.confirmCardPayment(secret, data);

      intent.then((confirmResult) => {
        if (confirmResult.error) {
          ev.complete("fail");
          this.$emit("preq-error");
        } else {
          ev.complete("success");
          this.$emit(
            "preq-approved",
            this.deposit === 0
              ? confirmResult.setupIntent
              : confirmResult.paymentIntent,
          );
        }
      });
    },
  },
  computed: {
    ...mapGetters("bookingEngine", ["contentTransactionPaymentForm"]),
  },
};
</script>

<style lang="scss" scoped>
#payment-request-button {
  max-width: 220px;
}
</style>
