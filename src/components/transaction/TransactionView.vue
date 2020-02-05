<template>
  <v-app class="room-view">
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-overlay :value="isError" opacity=".8">
      <div class="title">Network Error</div>
      <div class="body-1">
        Please check your connection and click below to try again
      </div>
      <v-btn icon>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-overlay>

    <v-container>
      <v-row no-gutters>
        <v-col cols="12 mb-6">
          <bread-crumbs :step="3" />
        </v-col>
      </v-row>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row no-gutters>
          <v-col cols="12">
            <v-expansion-panels v-model="openPanels" class="mb-6" multiple>
              <v-expansion-panel>
                <v-expansion-panel-header color="primary">
                  <div class="font-weight-bold white--text subtitle-2">
                    1/3 MAIN GUEST DETAILS
                  </div>
                  <template v-slot:actions>
                    <v-icon color="white">$expand</v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content color="white">
                  <v-card class="mt-4" tile flat>
                    <v-text-field
                      label="Full Name"
                      :rules="rules.name"
                      outlined=""
                    ></v-text-field>
                    <v-text-field
                      label="Email"
                      :rules="rules.email"
                      outlined
                    ></v-text-field>
                    <v-text-field
                      label="Phone Number"
                      :rules="rules.phone"
                      outlined=""
                    ></v-text-field>
                    <v-autocomplete
                      :items="countries"
                      label="Country"
                      :rules="rules.country"
                      outlined=""
                      item-value="key"
                      item-text="name"
                    ></v-autocomplete>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header color="primary">
                  <div class="font-weight-bold white--text subtitle-2">
                    2/3 LOYALTY OR COUPON CODE
                  </div>
                  <template v-slot:actions>
                    <v-icon color="white">$expand</v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content color="white">
                  <v-card class="mt-4" tile flat>
                    <v-text-field label="Enter code" outlined=""></v-text-field>
                    <v-btn
                      class="font-weight-bold white--text subtitle-1"
                      color="secondary"
                      width="100%"
                      large
                    >
                      APPLY CODE
                    </v-btn>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header color="primary">
                  <div class="font-weight-bold white--text subtitle-2">
                    3/3 PAYMENT DETAILS
                  </div>
                  <template v-slot:actions>
                    <v-icon color="white">$expand</v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content color="white">
                  <v-card class="mt-4" tile flat>
                    <v-row no-gutters>
                      <v-col cols="12">
                        <div
                          class="subtitle-1 text-left accent--text font-weight-bold"
                        >
                          1. How would you like to pay?
                        </div>
                      </v-col>
                      <v-col>
                        <v-checkbox
                          label="Credit / Debit Card"
                          class="mb-0"
                        ></v-checkbox>
                        <v-checkbox
                          label="PayPal Checkout"
                          class="mt-0"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12">
                        <div
                          class="subtitle-1 text-left accent--text font-weight-bold"
                        >
                          2. When do you want to pay?
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <v-radio-group
                          v-model="data.deposit"
                          class="payment-date"
                        >
                          <v-radio
                            :value="0"
                            label="Pay on Arrival"
                            class="pay-on-arrival"
                          ></v-radio>
                          <v-radio
                            :value="100"
                            label="Pay Now"
                            class="pay-now"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12">
                        <div
                          class="subtitle-1 text-left accent--text font-weight-bold"
                        >
                          3. Card Details
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <v-stripe-card
                          v-if="stripeReady"
                          ref="stripeCard"
                          :api-key="stripeKey"
                          outlined
                          tile
                        ></v-stripe-card>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="12">
                        <v-checkbox
                          label="I have read and accept the terms and conditions."
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-checkbox label="" />
                        Sign up for St Christopher’s Inns offers, deals, latest
                        travel guides, playlists and more. By opting in, you
                        agree to receive marketing emails from St Christopher’s
                        Inns Hostels. Your data will not be shared with any
                        third-party contacts. You can unsubscribe at any
                        time.All part of our Privacy Policy.
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-btn
                          class="font-weight-bold white--text subtitle-1"
                          large
                          width="100%"
                          color="secondary"
                          @click="submit"
                        >
                          Pay X $30.00
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
import Vue from "vue";
import VStripeElements from "v-stripe-elements/lib";
import BreadCrumbs from "../shared/BreadCrumbs.vue";

import { init } from "./api/reservation-svc";

Vue.use(VStripeElements);

export default {
  data() {
    return {
      reservation: null,
      stripeReady: false,
      stripeKey: "pk_test_m0eFJAIVQpT7S1OKH6YvkjlZ",
      valid: false,
      openPanels: [0, 1, 2],
      data: {
        deposit: 0,
      },
      rules: {
        email: [
          v => !!v || "E-mail is required",
          v => /.+@.+/.test(v) || "E-mail must be valid",
        ],
        name: [v => !!v || "Name is required"],
        phone: [v => !!v || "Phone Number is required"],
        country: [v => !!v || "Country is required"],
      },
      isLoading: false,
      isError: false,
      countries: [
        { key: "gb", name: "United Kingdom" },
        { key: "us1", name: "United States" },
        { key: "us2", name: "United States" },
        { key: "us3", name: "United States" },
        { key: "us4", name: "United States" },
        { key: "us5", name: "United States" },
        { key: "us6", name: "United States" },
        { key: "us7", name: "United States" },
        { key: "us8", name: "United States" },
        { key: "us9", name: "United States" },
        { key: "us10", name: "United States" },
        { key: "dk", name: "Denmark" },
      ],
    };
  },
  watch: {
    "data.deposit": {
      handler(deposit) {
        console.log(deposit);
      },
      deep: true,
    },
  },
  methods: {
    submit() {
      if (this.reservation.cart.deposit_model === 0) {
        this.$refs.stripeCard.stripe
          .confirmCardSetup(this.reservation.cardPaymentGateway.client_secret, {
            payment_method: {
              card: this.$refs.stripeCard.card,
            },
          })
          .then(result => {
            console.log(result);
          });
      } else {
        // todo
      }

      if (this.$refs.form.validate()) {
        console.log("valid");
      } else {
        console.log("not");
      }
    },
  },
  components: {
    BreadCrumbs,
  },
  async created() {
    try {
      this.reservation = await init();
    } catch (e) {
      console.log(e);
    }
  },
  mounted() {
    console.log(window.Stripe);
    if (!window.Stripe) {
      let stripeScript = document.createElement("script");
      stripeScript.setAttribute("src", "https://js.stripe.com/v3/");
      document.head.appendChild(stripeScript);

      const stripeWait = setTimeout(() => {
        if (window.Stripe) {
          this.stripeReady = true;
          clearTimeout(stripeWait);
        }
      }, 250);
    } else {
      this.stripeReady = true;
    }
  },
};
</script>

<style lang="scss" scoped></style>
