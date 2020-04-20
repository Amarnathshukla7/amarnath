<template>
  <main ref="transactionView" class="transaction-view">
    <v-overlay class="text-center" :value="isLoadingOverlay" :opacity="0.8">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
      <div style="max-width: 620px;" class="heading mt-10 px-6">
        Please wait while we confirm your payment and booking. This might take
        up to 30 seconds or more on slow internet connections. Please be patient
      </div>
    </v-overlay>

    <v-overlay :value="isError" opacity=".8" class="text-center">
      <div class="title">Error</div>
      <div class="body-1 px-4">
        <span v-if="isPmsError">
          Issue occurred creating booking, please refresh this page and try
          again. Reference:
          <br />
          <br />
          {{ reservation.booking_reference }}
        </span>
        <span v-else>Something unexpected went wrong, please try again</span>
      </div>
      <v-btn class="mt-4" icon @click="isError = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-overlay>
    <bread-crumbs :step="3" />
    <v-container>
      <v-row>
        <!-- <v-col cols="12" md="8" lg="6" offset-lg="1" xl="5" offset-xl="2"> -->
        <v-col cols="12" sm="6" md="7" lg="8" xl="5" offset-xl="2">
          <v-form ref="form" @submit.prevent>
            <v-row no-gutters>
              <v-col cols="12">
                <v-expansion-panels
                  v-model="openPanels"
                  multiple
                  class="transaction-view-panel--margin"
                >
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
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Full Name"
                              :rules="rules.name"
                              v-model="data.guest.name"
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Email"
                              class="mt-n6 mt-md-0"
                              :rules="rules.email"
                              v-model="data.guest.email"
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              class="mt-n6 mb-md-n6"
                              label="Phone Number"
                              :rules="rules.phone"
                              v-model="data.guest.phone"
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              class="mt-n6 mb-n6"
                              :items="countries"
                              label="Country"
                              :rules="rules.country"
                              v-model="data.guest.country"
                              outlined
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
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
                      <discount-code
                        :is-loading="isLoading"
                        @is-loading="(state) => (this.isLoading = state)"
                        @cart-updated="(cart) => (this.cart = cart)"
                      ></discount-code>
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
                          <v-col cols="12">
                            <v-radio-group
                              v-model="data.payMethod"
                              class="payment-date"
                            >
                              <v-row>
                                <v-col cols="12" sm="6" md="3">
                                  <v-radio value="card">
                                    <img
                                      slot="label"
                                      height="24"
                                      src="https://storage.googleapis.com/bedsandbars-images/card-icons1.02fa28e9.svg"
                                    />
                                  </v-radio>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                  <v-radio
                                    v-if="isPaypalEnabled"
                                    value="paypal"
                                  >
                                    <img
                                      slot="label"
                                      height="24"
                                      src="https://storage.googleapis.com/bedsandbars-images/paypal-icon.580dc673.svg"
                                    />
                                  </v-radio>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                  <v-radio
                                    v-if="digitalWalletEnabled && isStripe"
                                    value="digital"
                                  >
                                    <img
                                      v-if="isChrome"
                                      slot="label"
                                      height="24"
                                      src="https://storage.googleapis.com/bedsandbars-images/google-pay.8779b289.png"
                                    />
                                    <img
                                      v-if="isSafari"
                                      slot="label"
                                      height="24"
                                      src="https://storage.googleapis.com/bedsandbars-images/apple-pay.aac3a5bc.png"
                                    />
                                  </v-radio>
                                </v-col>
                              </v-row>
                            </v-radio-group>
                          </v-col>
                        </v-row>
                        <v-row v-show="showDepositChoice" no-gutters>
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
                                v-if="!showPaypal"
                                :value="lowerDeposit"
                                :label="lowerDepositLabel"
                              ></v-radio>
                              <v-radio :value="100" label="Pay Now"></v-radio>
                            </v-radio-group>
                          </v-col>
                        </v-row>
                        <v-row v-show="showCard" no-gutters>
                          <v-col cols="12">
                            <div
                              class="subtitle-1 text-left accent--text font-weight-bold"
                            >
                              3. Card Details
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <stripe-form
                              v-if="isStripe"
                              ref="stripeContainer"
                              :deposit="data.deposit"
                              :stripe-key="stripeKey"
                            ></stripe-form>
                            <sage-payment-form
                              v-if="isSagepay && !showPaypal"
                              ref="sagepayContainer"
                              :deposit="data.deposit"
                              :hostel-code="hostelConf.hostel_code"
                            />
                          </v-col>
                        </v-row>
                        <v-row v-show="data.payMethod" no-gutters>
                          <v-col cols="12">
                            <v-checkbox
                              v-model="data.terms"
                              :rules="rules.terms"
                            >
                              <label slot="label">
                                I have read and accept the
                                <a href="#">terms and conditions</a>.
                              </label>
                            </v-checkbox>
                          </v-col>
                          <v-col cols="12">
                            <v-checkbox
                              class="mt-n3"
                              v-model="data.newsletter"
                              label="Sign up for St Christopher’s Inns offers, deals,
                            latest travel guides, playlists and more. By opting
                            in, you agree to receive marketing emails from St
                            Christopher’s Inns Hostels. Your data will not be
                            shared with any third-party contacts. You can
                            unsubscribe at any time. All part of our Privacy
                            Policy."
                            />
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-expansion-panel-content>
                    <v-card
                      flat
                      tile
                      color="py-4"
                      :class="{
                        'white--text': isDesktop,
                        accent: isDesktop,
                      }"
                    >
                      <v-row no-gutters class="text-center">
                        <v-col class="hidden-md-and-down" cols="6">
                          <div class="subtitle-1 font-weight-bold d-inline">
                            Payable Now:
                          </div>
                          <div class="headline font-weight-bold d-inline">
                            {{ payable | formatPrice(hostelConf.currency) }}
                          </div>
                        </v-col>
                        <v-col cols="12" md="6">
                          <paypal-form
                            v-show="showPaypal"
                            :valid="valid"
                            :hostel="hostelConf"
                            :form-ref="$refs.form"
                            class="mx-auto"
                            @show-validation-error="validate"
                            @paypal-error="payPalError"
                            @paypal-approved="createPaypalReservation"
                          ></paypal-form>
                          <stripe-payment-request
                            v-if="isStripe"
                            ref="stripePaymentReqeuest"
                            :form-ref="$refs.form"
                            :cart="cart"
                            :currency="hostelConf.currency"
                            :stripe-key="stripeKey"
                            :deposit="data.deposit"
                            v-show="showWallet"
                            class="mx-auto"
                            @wallet-enabled="digitalWalletEnabled = true"
                            @show-validation-error="validate"
                            @preq-error="payPalError"
                            @preq-approved="createPreqReservation"
                          ></stripe-payment-request>
                          <v-btn
                            v-show="showCard || !data.payMethod"
                            class="font-weight-bold"
                            tile
                            x-large
                            py-2
                            color="secondary"
                            width="90%"
                            @click="cardReservation"
                            :disabled="!data.payMethod"
                          >
                            <span v-if="payable > 0">
                              PAY NOW
                              {{ payable | formatPrice(hostelConf.currency) }}
                            </span>
                            <span v-else>Confirm Booking</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
        <v-col cols="12" sm="6" md="5" lg="4" xl="3">
          <booking-summary
            :cart="cart"
            :currency="hostelConf.currency"
            :payable="payable"
            :breakfast="breakfast"
          ></booking-summary>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar top v-model="formErrorSnackbar">
      Please check that all fields in the form are filled out correctly
      <v-btn text @click="formErrorSnackbar = false">Close</v-btn>
    </v-snackbar>
  </main>
</template>

<script>
import Vue from "vue";
import VueLoadScript from "vue-load-script-plus";
import VStripeElements from "v-stripe-elements/lib";
import BreadCrumbs from "../shared/BreadCrumbs.vue";
import BookingSummary from "./components/summary/Summary.vue";
import countries from "./data/countries.json";
import { formatPrice } from "../../filters/money";
import { create } from "./api/reservation-svc";
import { set } from "idb-keyval";
import { bus } from "../../plugins/bus";

import DiscountCode from "./components/DiscountCode.vue";
import PaypalForm from "./components/PaypalForm.vue";
import StripeForm from "./components/StripeForm.vue";
import SagePaymentForm from "./components/SagePaymentForm.vue";
import StripePaymentRequest from "./components/StripePaymentRequest.vue";

Vue.use(VStripeElements);
Vue.use(VueLoadScript);

export default {
  components: {
    BreadCrumbs,
    BookingSummary,
    DiscountCode,
    PaypalForm,
    StripeForm,
    SagePaymentForm,
    StripePaymentRequest,
  },
  props: {
    stripeKey: {
      type: String,
      default: null,
    },
    cart: {
      type: Object,
      default: null,
    },
    hostelConf: {
      type: Object,
      defualt: null,
    },
    hostel: {
      type: Object,
      defualt: null,
    },
  },
  data() {
    return {
      digitalWalletEnabled: false,
      formErrorSnackbar: false,
      reservation: null,
      valid: false,
      openPanels: [0, 1, 2],
      data: {
        terms: false,
        newsletter: false,
        deposit: 0,
        payMethod: null,
        guest: {
          name: null,
          email: null,
          phone: null,
          country: null,
        },
      },
      rules: {
        email: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+/.test(v) || "E-mail must be valid",
        ],
        name: [(v) => !!v || "Name is required"],
        terms: [(v) => !!v || "Please accept our terms"],
        phone: [(v) => !!v || "Phone Number is required"],
        country: [(v) => !!v || "Country is required"],
      },
      isLoading: false,
      isLoadingOverlay: false,
      isError: false,
      countries,
    };
  },
  watch: {
    showPaypal() {
      this.data.deposit = 100;
    },
  },
  created() {
    bus.$on("cart-transaction-updated", (cart) => {
      this.cart = cart;
    });

    if (!this.isPaypalEnabled) this.data.payMethod = "card";
    this.data.deposit = this.cart.deposit_model_rate || 0;
  },
  mounted() {
    this.$refs.transactionView.scrollIntoView();
    this.$loadScript("https://js.stripe.com/v3/");
  },
  computed: {
    isChrome() {
      return (
        /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor)
      );
    },
    isSafari() {
      return (
        /Safari/.test(navigator.userAgent) &&
        /Apple Computer, Inc./.test(navigator.vendor)
      );
    },
    showDepositChoice() {
      return (
        this.data.payMethod === "card" || this.data.payMethod === "digital"
      );
    },
    isDesktop() {
      if (!window) return true;

      return window.innerWidth > 959;
    },
    isPmsError() {
      return this.reservation
        ? this.reservation.booking_error_action === "PMS_ERROR"
        : null;
    },
    roomsContent() {
      return this.hostel ? this.hostel.rooms : null;
    },
    totalCost() {
      return this.cart ? this.cart.total_cost : 0;
    },
    payable() {
      return this.cart ? (this.data.deposit / 100) * this.totalCost : 0;
    },
    isPaypalEnabled() {
      return this.hostelConf.is_paypal_enabled;
    },
    isSagepay() {
      return this.hostelConf.payment_gateway_name === "Sagepay";
    },
    isStripe() {
      return this.hostelConf.payment_gateway_name === "Stripe";
    },
    showPaypal() {
      return this.isPaypalEnabled && this.data.payMethod === "paypal";
    },
    showWallet() {
      return this.data.payMethod === "digital";
    },
    showCard() {
      return this.data.payMethod === "card";
    },
    breakfast() {
      if (!this.hostel.extras) return null;

      return this.hostel.extras.find(
        (extra) => extra.fields.type === "breakfast",
      ).fields;
    },
    lowerDeposit() {
      return this.cart.deposit_model_rate;
    },
    lowerDepositLabel() {
      return this.lowerDeposit === 0
        ? "Pay on Arrival"
        : `Pay ${this.lowerDeposit}%`;
    },
  },
  methods: {
    validate() {
      if (!this.$refs.form.validate()) {
        this.valid = false;
        this.formErrorSnackbar = true;
        return;
      }

      this.valid = true;
      return this.valid;
    },
    payPalError() {
      this.isError = true;
      this.isLoadingOverlay = false;
    },
    async createPaypalReservation(transaction) {
      this.isLoadingOverlay = true;

      try {
        this.completeTransaction(transaction, "paypal");
      } catch (e) {
        this.isError = true;
        this.isLoadingOverlay = false;
      }
    },
    createSagepayReservation() {},
    createPreqReservation(transaction) {
      this.isLoadingOverlay = true;

      try {
        this.completeTransaction(transaction, "stripe");
      } catch (e) {
        this.isError = true;
        this.isLoadingOverlay = false;
      }
    },
    async cardReservation() {
      if (!this.validate()) {
        this.formErrorSnackbar = true;
        return;
      }

      this.isLoadingOverlay = true;

      try {
        if (this.isStripe) {
          const transaction = await this.$refs.stripeContainer.createStripeTransaction();
          this.completeTransaction(transaction, "stripe");
        } else if (this.isSagepay) {
          const transaction = await this.$refs.sagepayContainer.createSagepayTransaction();
          console.log(transaction);
          this.completeTransaction(transaction, "sagepay");
        } else if (this.isDigitalWallet) {
          const transaction = await this.$refs.stripePaymentReqeuest.createStripePaymentRequest();
          console.log(transaction);
          this.completeTransaction(transaction, "sagepay");
        }
      } catch (e) {
        this.isError = true;
        this.isLoadingOverlay = false;
      }
    },
    async completeTransaction(transaction, gateway) {
      try {
        this.reservation = await create({
          deposit: this.data.deposit,
          guest: this.data.guest,
          transaction,
          gateway,
          marketing: this.data.newsletter,
        });

        if (this.reservation && this.reservation.status !== "success") {
          this.isError = true;
          this.isLoadingOverlay = false;
          return;
        }

        await set("reservation", this.reservation);

        const path =
          window.location.pathname.replace("availability", "") + "confirmation";

        this.$router.push({
          path,
        });
      } catch (e) {
        this.isError = true;
        this.isLoadingOverlay = false;
      }

      this.isLoadingOverlay = false;
    },
  },
  filters: {
    formatPrice,
  },
};
</script>

<style lang="scss" scoped>
.theme--light.v-expansion-panels .v-expansion-panel {
  background-color: #f8f8f8 !important;
}

.transaction-view-panel--margin {
  margin-bottom: 125px;
}
</style>
