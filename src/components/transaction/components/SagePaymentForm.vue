<template>
  <section class="sagepay">
    <v-overlay class="text-center" :value="overlay" width="100%" height="100%">
      <h1>Processing Payment...</h1>
      <iframe
        width="100%"
        height="100%"
        src=""
        name="paymentsageform"
        class="payment-sageform"
      ></iframe>
      <form
        v-if="threeD"
        :action="threeD.acsUrl"
        ref="sageform"
        method="post"
        target="paymentsageform"
        id="postToIframe"
      >
        <input type="hidden" name="PaReq" :value="threeD.paReq" />
        <input type="hidden" name="TermUrl" :value="threeD.url" />
        <input type="hidden" name="MD" :value="threeD.md" />
      </form>

      <br />
      <v-btn x-large icon @click="overlay = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-overlay>
    <v-row mx-4>
      <v-col cols="12" md="12">
        <v-text-field
          class="mb-0"
          label="Name on Card*"
          :rules="rules.nameOnCard"
          v-model="payment.nameOnCard"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          class="mb-0 mt-n6"
          label="Card Number*"
          :rules="rules.cardNumber"
          v-model="card.number"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          class="mb-0 mt-n6"
          label="Expiry Date*"
          hint="MM/YY"
          :rules="rules.cardExpiry"
          v-model="card.expiry"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          class="mb-0 mt-n6"
          label="CVV*"
          hint="On the back of your card"
          :rules="rules.cardSecurityCode"
          v-model="card.code"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="Address Line 1*"
          class="mt-n6"
          :rules="rules.address1"
          v-model="payment.address1"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="Address Line 2"
          class="mt-n6"
          v-model="payment.address2"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="City*"
          class="mt-n6"
          :rules="rules.city"
          v-model="payment.city"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="Post Code*"
          class="mt-n6"
          :rules="rules.postCode"
          v-model="payment.postCode"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          class="mt-n6"
          :items="countries"
          label="Country*"
          :rules="rules.country"
          v-model="payment.country"
          outlined
        ></v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-if="false"
          class="mt-n6 mb-md-n6"
          label="State"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import axios from "axios";
import { create } from "../api/transaction-svc";
import countries from "../data/countries.json";

export default {
  props: {
    deposit: {
      type: Number,
      default: 0,
    },
    hostelCode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      transaction: null,
      overlay: false,
      threeD: null,
      countries,
      card: {
        number: null,
        expiry: null,
        code: null,
      },
      payment: {
        nameOnCard: null,
        address1: null,
        address2: null,
        city: null,
        postCode: null,
        country: null,
      },
      rules: {
        cardNumber: [
          (v) => !!v || "Card number is required",
          (v) => {
            const pattern = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
            return (
              pattern.test(v) ||
              "Invalid card number. Please type without any spaces"
            );
          },
        ],
        cardExpiry: [
          (v) => !!v || "Card Expiry is required",
          (v) => {
            const pattern = /^(0?[1-9]|1[0-2]){1}\/(0?[1-9]|1[0-9]|2[0-9]|3[0-1]){1}$/;
            return pattern.test(v) || "Invalid date format (MM/DD)";
          },
          //
        ],
        cardSecurityCode: [(v) => !!v || "CVV is required"],
        nameOnCard: [(v) => !!v || "Name on card is required"],
        address1: [(v) => !!v || "Address Line 1 is required"],
        city: [(v) => !!v || "City is required"],
        postCode: [(v) => !!v || "Post Code is required"],
        country: [(v) => !!v || "Country is required"],
      },
    };
  },
  methods: {
    async createSagepayTransaction() {
      let transaction = await create("sagepay", this.deposit);
      const secret = JSON.parse(transaction.secret_output)[
        "merchantSessionKey"
      ];

      const url =
        process.env.NODE_ENV === "production"
          ? "https://pi-live.sagepay.com/api/v1/card-identifiers"
          : "https://pi-test.sagepay.com/api/v1/card-identifiers";

      const cardIdentifier = await axios
        .post(
          url,
          {
            cardDetails: {
              cardholderName: this.payment.nameOnCard,
              cardNumber: this.card.number,
              expiryDate: this.card.expiry.replace("/", ""),
              securityCode: this.card.code,
            },
          },
          {
            headers: { Authorization: `Bearer ${secret}` },
          },
        )
        .then((res) => res.data.cardIdentifier);

      this.transaction = await axios
        .put(`/transaction-svc/${transaction.id}`, {
          gateway: "sagepay",
          hostelCode: this.hostelCode,
          payment: {
            cardIdentifier,
            name: this.payment.nameOnCard,
            address1: this.payment.address1,
            address2: this.payment.address2,
            city: this.payment.city,
            postCode: this.payment.postCode,
            country: this.payment.country,
          },
        })
        .then((res) => res.data);

      if (this.transaction.status === "REDIRECT_3D") {
        this.threeD = JSON.parse(this.transaction.secret_output);
        this.overlay = true;
        this.$nextTick(() => {
          this.$refs.sageform.submit();
        });

        return null;
      }

      const card =
        this.hostelCode === "COP"
          ? {
              number: this.card.number,
              expiry: this.card.expiry,
              nameOnCard: this.payment.nameOnCard,
            }
          : null;

      return {
        transaction: this.transaction,
        card,
      };
    },
    receiveMessage(event) {
      if (
        [
          "http://localhost:8000",
          "https://reservation.svc.bedsandbars.com/",
        ].includes(event.origin)
      ) {
        this.overlay = false;
        console.log(event.data);
        if (event.data.status == "OK") {
          this.$emit("complete-transaction", this.transaction, {
            number: this.card.number,
            expiry: this.card.expiry,
            nameOnCard: this.payment.nameOnCard,
          });
        } else {
          this.$emit("payment-failed", "Failed to authenticate with bank");
        }
      }
    },
    addPostMessageListener() {
      window.addEventListener("message", this.receiveMessage);
    },
    removePostMessageListener() {
      window.removeEventListener("message", this.receiveMessage);
    },
  },
  mounted() {
    this.addPostMessageListener();
  },
  destroyed() {
    this.removePostMessageListener();
  },
};
</script>

<style>
.sagepay .v-overlay__content {
  width: 100%;
  height: 100%;
}
</style>
