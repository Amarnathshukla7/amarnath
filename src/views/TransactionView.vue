<template>
  <v-app>
    <main ref="transactionView" class="transaction-view">
      <TransactionOverlayLoading
        :loading-overlay="isLoadingOverlay"
        :loading-reservation="isLoadingReservation"
      />

      <TransactionOverlayError
        v-if="uiContentLoaded"
        :error="isError"
        :reservation="reservation"
      />

      <TheBreadCrumbs
        v-if="uiContentLoaded"
        :step="3"
        :content="contentTheBreadCrumbs"
      />

      <v-container v-if="hostel && hostelConf">
        <v-row>
          <v-col cols="12" class="hidden-sm-and-up">
            <TransactionSearchSummaryMobile
              v-if="uiContentLoaded"
              :hostel-code="cart.hostel_code"
              :arrival-date="cart.check_in"
              :departure-date="cart.check_out"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6" md="7" lg="8" xl="5" offset-xl="2">
            <v-form ref="form" @submit.prevent>
              <v-row no-gutters>
                <v-col cols="12">
                  <v-expansion-panels
                    v-if="uiContentLoaded"
                    v-model="openPanels"
                    multiple
                    class="transaction-view-panel--margin"
                  >
                    <!-- MAIN GUEST DETAILS -->
                    <v-expansion-panel>
                      <v-expansion-panel-header color="primary">
                        <div
                          class="font-weight-bold white--text subtitle-2 text-uppercase"
                        >
                          {{
                            journeyUi.expansionPanelHeaders.transaction.guest
                          }}
                        </div>
                        <template v-slot:actions>
                          <v-icon color="white">$expand</v-icon>
                        </template>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content color="white">
                        <v-card class="mt-4" tile flat>
                          <v-row>
                            <!-- NAME -->
                            <v-col cols="12" md="6">
                              <v-text-field
                                :label="journeyUi.guestDetailsForm.name.label"
                                :rules="rules.name"
                                v-model="data.guest.name"
                                outlined
                              ></v-text-field>
                            </v-col>

                            <!-- EMAIL -->
                            <v-col cols="12" md="6">
                              <v-text-field
                                :label="journeyUi.guestDetailsForm.email.label"
                                class="mt-n6 mt-md-0"
                                :rules="rules.email"
                                v-model="data.guest.email"
                                outlined
                              ></v-text-field>
                            </v-col>

                            <!-- PHONE -->
                            <v-col cols="12" md="6">
                              <v-text-field
                                class="mt-n6 mb-md-n6"
                                :label="journeyUi.guestDetailsForm.phone.label"
                                :rules="rules.phone"
                                v-model="data.guest.phone"
                                outlined
                              ></v-text-field>
                            </v-col>

                            <!-- COUNTRY -->
                            <v-col cols="12" md="6">
                              <v-autocomplete
                                class="mt-n6 mb-n6"
                                :items="countries"
                                :label="
                                  journeyUi.guestDetailsForm.country.label
                                "
                                :rules="rules.country"
                                v-model="data.guest.country"
                                outlined
                              ></v-autocomplete>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <!-- END: MAIN GUEST DETAILS -->

                    <!-- COUPON CODE -->
                    <v-expansion-panel>
                      <v-expansion-panel-header color="primary">
                        <div
                          class="font-weight-bold white--text subtitle-2 text-uppercase"
                        >
                          {{
                            journeyUi.expansionPanelHeaders.transaction.coupon
                          }}
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
                    <!-- END: COUPON CODE -->

                    <!-- PAYMENT -->
                    <v-expansion-panel>
                      <v-expansion-panel-header color="primary">
                        <div
                          class="font-weight-bold white--text subtitle-2 text-uppercase"
                        >
                          {{
                            journeyUi.expansionPanelHeaders.transaction.payment
                          }}
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
                                <!-- How would you like to pay? -->
                                1. {{ journeyUi.paymentForm.s1.question }}
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
                                <!-- When would you like to pay? -->
                                2. {{ journeyUi.paymentForm.s2.question }}
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
                                <v-radio
                                  :value="100"
                                  :label="
                                    this.$store.state.journeyUi.paymentForm.s2
                                      .now
                                  "
                                ></v-radio>
                              </v-radio-group>
                            </v-col>

                            <v-col
                              v-if="isStripe"
                              v-show="
                                data.deposit !== 0 && data.deposit !== null
                              "
                              cols="12"
                              md="6"
                            >
                              <div
                                class="subtitle-1 text-left accent--text font-weight-bold"
                              >
                                <!-- Preferred Currency -->
                                3. {{ journeyUi.paymentForm.s3.question }}
                              </div>

                              <v-autocomplete
                                class="mt-2"
                                :items="currencies"
                                item-value="key"
                                item-text="value"
                                :label="
                                  this.$store.state.journeyUi.paymentForm.s3
                                    .label
                                "
                                :rules="rules.country"
                                v-model="selectedCurrency"
                                outlined
                              ></v-autocomplete>
                            </v-col>
                          </v-row>

                          <v-row v-show="showCard" no-gutters>
                            <v-col cols="12">
                              <div
                                class="subtitle-1 text-left accent--text font-weight-bold"
                              >
                                <span
                                  v-if="
                                    data.deposit === 0 ||
                                    data.deposit === null ||
                                    !isStripe
                                  "
                                  >3.
                                </span>
                                <span v-else>4. </span>
                                <!-- Card Details -->
                                {{ journeyUi.paymentForm.s4.question }}
                              </div>
                            </v-col>

                            <v-col cols="12">
                              <stripe-form
                                v-if="isStripe"
                                ref="stripeContainer"
                                :deposit="data.deposit"
                                :stripe-key="stripeKey"
                                :selected-currency="selectedCurrency"
                              ></stripe-form>

                              <sage-payment-form
                                v-if="isSagepay && !showPaypal"
                                ref="sagepayContainer"
                                :deposit="data.deposit"
                                :selected-currency="selectedCurrency"
                                :hostel-code="hostelConf.hostel_code"
                                @payment-failed="payPalError"
                                @complete-transaction="
                                  (transaction, card) =>
                                    completeTransaction(
                                      transaction,
                                      'sagepay',
                                      card,
                                    )
                                "
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
                                  <a
                                    :href="termsLink"
                                    target="_blank"
                                    @click.stop
                                  >
                                    terms and conditions</a
                                  >.
                                </label>
                              </v-checkbox>
                            </v-col>

                            <v-col cols="12">
                              <v-checkbox
                                class="mt-n3"
                                v-model="data.newsletter"
                              >
                                <p slot="label">
                                  {{
                                    journeyUi.paymentForm.s5.marketingOptInMsg
                                  }}
                                  All part of our
                                  <a
                                    href="http://www.bedsandbars.com/privacy-and-cookies"
                                    target="_blank"
                                    @click.stop
                                  >
                                    privacy policy</a
                                  >.
                                </p>
                              </v-checkbox>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-expansion-panel-content>

                      <!-- PAYABLE NOW -->
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
                              {{ journeyUi.paymentForm.other.payableNow }}:
                            </div>
                            <div class="headline font-weight-bold d-inline">
                              {{
                                payable
                                  | convertCurrency(currencyRate)
                                  | formatPrice(selectedCurrency)
                              }}
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
                              :disabled="!data.payMethod || isLoading"
                            >
                              <span v-if="payable > 0">
                                {{ journeyUi.paymentForm.other.button.payNow }}
                                {{
                                  payable
                                    | convertCurrency(currencyRate)
                                    | formatPrice(selectedCurrency)
                                }}
                              </span>
                              <span v-else>{{
                                journeyUi.paymentForm.other.button.payArrival
                              }}</span>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                      <!-- END: PAYABLE NOW -->
                    </v-expansion-panel>
                    <!-- END: PAYMENT -->
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-form>
          </v-col>

          <v-col cols="12" sm="6" md="5" lg="4" xl="3">
            <BookingSummary
              :cart="cart"
              :currency="hostelConf.currency"
              :selected-currency-rate="currencyRate"
              :selected-currency="selectedCurrency"
              :payable="payable"
              :breakfast="breakfast"
              :deposit="data.deposit"
              :rooms-content="roomsContent"
            />
          </v-col>
        </v-row>
      </v-container>

      <v-snackbar top v-model="formErrorSnackbar">
        {{ journeyUi.paymentForm.other.errorBar.errorMsg }}
        <v-btn text @click="formErrorSnackbar = false">{{
          journeyUi.paymentForm.other.errorBar.errorButton
        }}</v-btn>
      </v-snackbar>
    </main>
  </v-app>
</template>

<script>
// Packages
import { mapState, mapGetters } from "vuex";
import { set, get, del } from "idb-keyval";
import VStripeElements from "v-stripe-elements/lib";
import Vue from "vue";
import VueLoadScript from "vue-load-script-plus";

// APIs
import { getCurrencyRate } from "../api/transaction/cart-svc";
import { create } from "../api/transaction/reservation-svc";
import { find } from "../api/room/reservation-svc/hostel-svc";

// Helpers, Plugins, Filters & Data
import { bus } from "../plugins/bus";
import countries from "../data/countries";
import { formatDate } from "../filters/date";
import { formatPrice, convertCurrency } from "../filters/money";
import { getHostel } from "../plugins/hostel";
import { hostelShortName } from "../helpers/hostelNames";

// Components
import BookingSummary from "../components/transaction/summary/Summary";
import TheBreadCrumbs from "../components/TheBreadCrumbs";
import DiscountCode from "../components/transaction/DiscountCode";
import TransactionOverlayError from "../components/TransactionOverlayError";
import TransactionOverlayLoading from "../components/TransactionOverlayLoading";
import TransactionSearchSummaryMobile from "../components/TransactionSearchSummaryMobile";
import PaypalForm from "../components/transaction/PaypalForm";
import SagePaymentForm from "../components/transaction/SagePaymentForm";
import StripeForm from "../components/transaction/StripeForm";
import StripePaymentRequest from "../components/transaction/StripePaymentRequest";

Vue.use(VStripeElements);
Vue.use(VueLoadScript);

export default {
  components: {
    TheBreadCrumbs,
    BookingSummary,
    DiscountCode,
    TransactionOverlayError,
    TransactionOverlayLoading,
    TransactionSearchSummaryMobile,
    PaypalForm,
    StripeForm,
    SagePaymentForm,
    StripePaymentRequest,
  },
  props: {
    stripeKey: {
      type: String,
      default: "pk_test_97WWfDjUOsVWAzm3y1g8t0BJ00F4iyqoge",
    },
  },
  data() {
    return {
      guest: null,
      cart: null,
      selectedCurrency: null,
      isLoadingReservation: false,
      hostelConf: null,
      hostel: null,
      currencyRate: 1,
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
          (v) =>
            !!v ||
            this.$store.state.journeyUi.guestDetailsForm.email.rules.required,
          (v) =>
            /.+@.+/.test(v) ||
            this.$store.state.journeyUi.guestDetailsForm.email.rules.required,
        ],
        name: [
          (v) =>
            !!v ||
            this.$store.state.journeyUi.guestDetailsForm.name.rules.required,
        ],
        terms: [
          (v) =>
            !!v || this.$store.state.journeyUi.paymentForm.s5.rules.required,
        ],
        phone: [
          (v) =>
            !!v ||
            this.$store.state.journeyUi.guestDetailsForm.phone.rules.required,
        ],
        country: [
          (v) =>
            !!v ||
            this.$store.state.journeyUi.guestDetailsForm.name.rules.required,
        ],
      },
      isLoading: false,
      isLoadingOverlay: false,
      isError: false,
      uiContentLoaded: null,
      countries,
      currencies: [
        {
          key: "GBP",
          value: "GBP - British Pound",
        },
        {
          key: "EUR",
          value: "EUR - Euro",
        },
        {
          key: "USD",
          value: "USD - US Dollar",
        },
        {
          key: "AUD",
          value: "AUD - Australian Dollar",
        },
        {
          key: "CAD",
          value: "CAD - Canadian Dollar",
        },
      ],
    };
  },
  watch: {
    showPaypal() {
      this.data.deposit = 100;
    },
    async selectedCurrency(curr) {
      this.isLoading = true;
      try {
        this.currencyRate = await getCurrencyRate(curr);
      } catch (error) {
        if (this.hostelConf.currency === curr) {
          this.currencyRate = 1;
        }

        this.selectedCurrency = this.hostelConf.currency;
      }
      this.isLoading = false;
    },
  },
  async beforeCreate() {
    await this.$store.dispatch("getJourneyUi");
    this.uiContentLoaded = this.journeyUi;
  },
  async created() {
    this.isLoading = true;
    this.isLoadingOverlay = true;

    bus.$on("cart-transaction-updated", (cart) => {
      this.cart = cart;
    });

    this.cart = await get("cart");

    // const devReservation = {
    //   cart: {
    //     currency: "GBP",
    //   },
    //   // cart: {
    //   //   hostel: {
    //   //     currency: "GBP",
    //   //   },
    //   // },
    // };

    // await set("dev-reservation", devReservation);

    await this.$store.dispatch("getHostel", this.cart.hostel_code);
    // const [hostelConf, hostel] = await Promise.all([
    const [hostelConf] = await Promise.all([
      find(this.cart.hostel_code),
      // getHostel(this.cart.hostel_code),
    ]);

    // this.guest = this.$store?.$auth?.$state?.user;
    // if (this.guest && this.guest.type === "agent") {
    //   this.data.guest.name = this.guest.name;
    //   this.data.guest.country = this.guest.country;
    //   this.data.guest.email = this.guest.email;
    //   this.data.guest.phone = this.guest.phone;
    // }

    this.hostelConf = hostelConf;
    // this.hostel = hostel;
    this.hostel = this.hostelData;

    if (this.hostel.code === "PRA") {
      this.currencies.push({
        key: "CZK",
        value: "CZK - Czech koruna",
      });
    }

    this.selectedCurrency = this.hostelConf.currency;

    if (!this.isPaypalEnabled) this.data.payMethod = "card";
    this.data.deposit = this.cart.deposit_model_rate || 0;

    this.loading = false;
    this.isLoadingOverlay = false;
    this.isLoadingReservation = false;
  },
  mounted() {
    this.$refs.transactionView.scrollIntoView();
    this.$loadScript("https://js.stripe.com/v3/");
    window.addEventListener("beforeunload", this.preventCloseByAccident);
    window.addEventListener("popstate", this.preventCloseByAccident);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.preventCloseByAccident);
    window.removeEventListener("popstate", this.preventCloseByAccident);
  },
  computed: {
    termsLink() {
      if (["FPU", "FPD"].includes(this.hostelCode)) {
        return "https://www.flyingpig.nl/terms-and-conditions";
      } else if (this.hostel.code == "COP") {
        return "https://www.copenhagendowntown.com/terms";
      } else {
        return "https://www.st-christophers.co.uk/hostel-terms-and-conditions";
      }
      // return ["FPU", "FPD"].includes(this.hostelConf.code)
      //   ? "https://www.flyingpig.nl/terms-and-conditions"
      //   : "https://www.st-christophers.co.uk/hostel-terms-and-conditions";
    },
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
      if (!this.hostelConf) return null;
      return this.hostelConf.is_paypal_enabled;
    },
    isSagepay() {
      if (!this.hostelConf) return null;
      return this.hostelConf.payment_gateway_name === "Sagepay";
    },
    isStripe() {
      if (!this.hostelConf) return null;
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
        ? this.$store.state.journeyUi.paymentForm.s2.arrival
        : `Pay ${this.lowerDeposit}%`;
    },
    ...mapState(["journeyUi", "hostelData"]),
    ...mapGetters(["contentTheBreadCrumbs"]),
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
    preventCloseByAccident(event) {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = "";

      return confirm(this.$store.state.journeyUi.paymentForm.other.abandon);
    },
    payPalError() {
      this.isError = true;
      this.isLoadingOverlay = false;
      this.isLoadingReservation = false;
    },
    async createPaypalReservation(transaction) {
      this.isLoadingOverlay = true;
      this.isLoadingReservation = true;

      try {
        this.completeTransaction(transaction, "paypal");
      } catch (e) {
        this.isError = true;
        this.isLoadingOverlay = false;
        this.isLoadingReservation = false;
      }
    },
    createSagepayReservation() {},
    createPreqReservation(transaction) {
      this.isLoadingOverlay = true;
      this.isLoadingReservation = true;

      try {
        this.completeTransaction(transaction, "stripe");
      } catch (e) {
        this.isError = true;
        this.isLoadingOverlay = false;
        this.isLoadingReservation = false;
      }
    },
    async cardReservation() {
      if (!this.validate()) {
        this.formErrorSnackbar = true;
        return;
      }

      this.isLoadingOverlay = true;
      this.isLoadingReservation = true;

      try {
        if (this.isStripe) {
          const transaction = await this.$refs.stripeContainer.createStripeTransaction();
          this.completeTransaction(transaction, "stripe");
        } else if (this.isSagepay) {
          const transaction = await this.$refs.sagepayContainer.createSagepayTransaction();
          if (!transaction.transaction) {
            this.isLoadingOverlay = false;
            this.isLoadingReservation = false;
            return;
          }
          this.completeTransaction(
            transaction.transaction,
            "sagepay",
            transaction.card,
          );
        }
      } catch (e) {
        this.isError = true;
        this.isLoadingOverlay = false;
        this.isLoadingReservation = false;
      }
    },
    async completeTransaction(transaction, gateway, card = null) {
      try {
        this.reservation = await create({
          deposit: this.data.deposit,
          guest: this.data.guest,
          transaction,
          gateway,
          card,
          marketing: this.data.newsletter,
        });

        if (this.reservation && this.reservation.status !== "success") {
          this.isError = true;
          this.isLoadingOverlay = false;
          this.isLoadingReservation = false;
          return;
        }

        await set("reservation", this.reservation);
        await del("cart");

        const path =
          window.location.pathname.replace("payment", "") + "confirmation";

        this.$router.push({
          path,
        });
      } catch (e) {
        this.isError = true;
        this.isLoadingOverlay = false;
        this.isLoadingReservation = false;
      }
    },
    hostelShortName,
  },
  filters: {
    formatDate,
    formatPrice,
    convertCurrency,
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

.v-card__subtitle.reservation-info {
  font-size: 1rem;
}
</style>
