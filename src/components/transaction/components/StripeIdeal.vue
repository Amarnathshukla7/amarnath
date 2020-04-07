<template>
  <div>
    <v-text-field
      label="Accountholder name"
      :rules="rules.name"
      v-model="name"
      outlined
    ></v-text-field>
    <div id="ideal-bank-element"></div>
  </div>
</template>

<script>
import { create } from "../api/transaction-svc";
export default {
  props: {
    stripeKey: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      stripe: null,
      name: null,
      idealBank: null,
      rules: {
        name: [v => !!v || "Name is required"],
      },
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
      this.stripe = window.Stripe(this.stripeKey);
      const elements = this.stripe.elements();

      const options = {
        // Custom styling can be passed to options when creating an Element
        style: {
          base: {
            backgroundColor: "#eee",
            padding: "10px 12px",
            color: "#32325d",
            fontSize: "16px",
            "::placeholder": {
              color: "#aab7c4",
            },
          },
        },
      };

      this.idealBank = elements.create("idealBank", options);
      this.idealBank.mount("#ideal-bank-element");
    },
    async confirm() {
      const transaction = await create("stripe", 100);
      const secret = JSON.parse(transaction.secret_output)["secret"];

      this.stripe.confirmIdealPayment(secret, {
        payment_method: {
          ideal: this.idealBank,
          billing_details: {
            name: this.name,
          },
        },
        return_url: "http://localhost:8080/confirmation",
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
