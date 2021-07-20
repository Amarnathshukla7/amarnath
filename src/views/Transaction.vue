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
              :language="userLanguage"
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
                          class="
                            font-weight-bold
                            white--text
                            subtitle-2
                            text-uppercase
                          "
                        >
                          {{ contentTransactionPanelHeaders.transaction.guest }}
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
                                :label="
                                  contentTransactionGuestDetails.name.label
                                "
                                :rules="rules.name"
                                v-model="data.guest.name"
                                outlined
                              ></v-text-field>
                            </v-col>

                            <!-- EMAIL -->
                            <v-col cols="12" md="6">
                              <v-text-field
                                :label="
                                  contentTransactionGuestDetails.email.label
                                "
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
                                :label="
                                  contentTransactionGuestDetails.phone.label
                                "
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
                                  contentTransactionGuestDetails.country.label
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
                          class="
                            font-weight-bold
                            white--text
                            subtitle-2
                            text-uppercase
                          "
                        >
                          {{
                            contentTransactionPanelHeaders.transaction.coupon
                          }}
                        </div>
                        <template v-slot:actions>
                          <v-icon color="white">$expand</v-icon>
                        </template>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content color="white">
                        <TransactionFormDiscountCode
                          :is-loading="isLoading"
                          @is-loading="(state) => (this.isLoading = state)"
                          @cart-updated="(cart) => (this.cart = cart)"
                        />
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <!-- END: COUPON CODE -->

                    <!-- PAYMENT -->
                    <v-expansion-panel>
                      <v-expansion-panel-header color="primary">
                        <div
                          class="
                            font-weight-bold
                            white--text
                            subtitle-2
                            text-uppercase
                          "
                        >
                          {{
                            contentTransactionPanelHeaders.transaction.payment
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
                                class="
                                  subtitle-1
                                  text-left
                                  accent--text
                                  font-weight-bold
                                "
                              >
                                <!-- How would you like to pay? -->
                                1.
                                {{ contentTransactionPaymentForm.s1.question }}
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
                                class="
                                  subtitle-1
                                  text-left
                                  accent--text
                                  font-weight-bold
                                "
                              >
                                <!-- When would you like to pay? -->
                                2.
                                {{ contentTransactionPaymentForm.s2.question }}
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
                                  :label="contentTransactionPaymentForm.s2.now"
                                ></v-radio>
                              </v-radio-group>
                            </v-col>

                            <v-col
                              v-if="isStripe && showCurrencySelector"
                              v-show="
                                data.deposit !== 0 && data.deposit !== null
                              "
                              cols="12"
                              md="6"
                            >
                              <div
                                class="
                                  subtitle-1
                                  text-left
                                  accent--text
                                  font-weight-bold
                                "
                              >
                                <!-- Preferred Currency -->
                                3.
                                {{ contentTransactionPaymentForm.s3.question }}
                              </div>

                              <v-autocomplete
                                v-if="currencies"
                                class="mt-2"
                                :items="currencies"
                                item-value="key"
                                item-text="value"
                                :label="contentTransactionPaymentForm.s3.label"
                                :rules="rules.country"
                                v-model="selectedCurrency"
                                outlined
                              ></v-autocomplete>
                            </v-col>
                          </v-row>

                          <v-row v-show="showCard" no-gutters>
                            <v-col cols="12">
                              <div
                                class="
                                  subtitle-1
                                  text-left
                                  accent--text
                                  font-weight-bold
                                "
                              >
                                <span
                                  v-if="
                                    data.deposit === 0 ||
                                    data.deposit === null ||
                                    !isStripe ||
                                    !showCurrencySelector
                                  "
                                  >3.
                                </span>
                                <span v-else>4. </span>
                                <!-- Card Details -->
                                {{ contentTransactionPaymentForm.s4.question }}
                              </div>
                            </v-col>

                            <v-col cols="12">
                              <TransactionFormPaymentStripeCard
                                v-if="isStripe && stripeApiKey"
                                ref="stripeContainer"
                                :deposit="data.deposit"
                                :stripe-key="stripeApiKey"
                                :selected-currency="selectedCurrency"
                              />

                              <TransactionFormPaymentSage
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
                                  <TranslationWithAnchor
                                    styleClass=""
                                    :text="
                                      contentTransactionPaymentForm.s5
                                        .termsAndConditionsMsg
                                    "
                                    :link="termsLink"
                                    target="_blank"
                                  />
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
                                    contentTransactionPaymentForm.s5
                                      .marketingOptInMsg
                                  }}
                                  <TranslationWithAnchor
                                    styleClass=""
                                    :text="
                                      contentTransactionPaymentForm.s5
                                        .privacyPolicyMsg
                                    "
                                    link="http://www.bedsandbars.com/privacy-and-cookies"
                                    target="_blank"
                                  />
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
                          <v-col class="hidden-md-and-down pt-3" cols="6">
                            <div class="subtitle-1 font-weight-bold d-inline">
                              {{
                                contentTransactionPaymentForm.other.payableNow
                              }}:
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
                            <TransactionFormPaymentPaypal
                              v-show="showPaypal"
                              :valid="valid"
                              :hostel="hostelConf"
                              :form-ref="$refs.form"
                              class="mx-auto"
                              @show-validation-error="validate"
                              @paypal-error="payPalError"
                              @paypal-approved="createPaypalReservation"
                            />

                            <TransactionFormPaymentStripePaymentRequest
                              v-if="isStripe"
                              ref="stripePaymentReqeuest"
                              :form-ref="$refs.form"
                              :cart="cart"
                              :currency="hostelConf.currency"
                              :stripe-key="stripeApiKey"
                              :deposit="data.deposit"
                              v-show="showWallet"
                              class="mx-auto"
                              @wallet-enabled="digitalWalletEnabled = true"
                              @show-validation-error="validate"
                              @preq-error="payPalError"
                              @preq-approved="createPreqReservation"
                            />

                            <v-btn
                              v-show="showCard || !data.payMethod"
                              class="font-weight-bold"
                              id="pay-method-btn"
                              tile
                              x-large
                              py-2
                              color="secondary"
                              width="90%"
                              @click="cardReservation"
                              :disabled="!data.payMethod || isLoading"
                            >
                              <span v-if="payable > 0">
                                {{
                                  contentTransactionPaymentForm.other.button
                                    .payNow
                                }}
                                {{
                                  payable
                                    | convertCurrency(currencyRate)
                                    | formatPrice(selectedCurrency)
                                }}
                              </span>
                              <span v-else>{{
                                contentTransactionPaymentForm.other.button
                                  .payArrival
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
            <TransactionSummary
              :cart="cart"
              :currency="hostelConf.currency"
              :language="userLanguage"
              :selected-currency-rate="currencyRate"
              :selected-currency="selectedCurrency"
              :payable="payable"
              :breakfast="breakfast"
              :deposit="data.deposit"
              :rooms-content="roomsContent"
              :panel-header="contentTransactionPanelHeaders.transaction.summary"
            />
          </v-col>
        </v-row>
      </v-container>

      <v-snackbar top v-model="formErrorSnackbar">
        {{ contentTransactionPaymentForm.other.errorBar.errorMsg }}
        <v-btn text @click="formErrorSnackbar = false">{{
          contentTransactionPaymentForm.other.errorBar.errorButton
        }}</v-btn>
      </v-snackbar>
    </main>
  </v-app>
</template>

<script>
// Packages
import { mapGetters, mapState } from "vuex";
import { set as idbSet, get as idbGet, del as idbDel } from "idb-keyval";
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
import { getCurrencies } from "../data/currencies";

// Components
import TheBreadCrumbs from "../components/TheBreadCrumbs";
import TranslationWithAnchor from "../components/TranslationWithAnchor";
import TransactionSummary from "../components/TransactionSummary";
import TransactionFormDiscountCode from "../components/TransactionFormDiscountCode";
import TransactionOverlayError from "../components/TransactionOverlayError";
import TransactionOverlayLoading from "../components/TransactionOverlayLoading";
import TransactionSearchSummaryMobile from "../components/TransactionSearchSummaryMobile";
import TransactionFormPaymentPaypal from "../components/TransactionFormPaymentPaypal";
import TransactionFormPaymentSage from "../components/TransactionFormPaymentSage";
import TransactionFormPaymentStripeCard from "../components/TransactionFormPaymentStripeCard";
import TransactionFormPaymentStripePaymentRequest from "../components/TransactionFormPaymentStripePaymentRequest";

Vue.use(VStripeElements);
Vue.use(VueLoadScript);

export default {
  components: {
    TheBreadCrumbs,
    TranslationWithAnchor,
    TransactionSummary,
    TransactionFormDiscountCode,
    TransactionOverlayError,
    TransactionOverlayLoading,
    TransactionSearchSummaryMobile,
    TransactionFormPaymentPaypal,
    TransactionFormPaymentStripeCard,
    TransactionFormPaymentSage,
    TransactionFormPaymentStripePaymentRequest,
  },
  props: {
    stripeKey: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      guest: null,
      cart: null,
      selectedCurrency: null,
      userLanguage: "en-GB",
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
            !!v || this.contentTransactionGuestDetails.email.rules.required,
          (v) =>
            /.+@.+/.test(v) ||
            this.contentTransactionGuestDetails.email.rules.required,
        ],
        name: [
          (v) => !!v || this.contentTransactionGuestDetails.name.rules.required,
        ],
        terms: [
          (v) => !!v || this.contentTransactionPaymentForm.s5.rules.required,
        ],
        phone: [
          (v) =>
            !!v || this.contentTransactionGuestDetails.phone.rules.required,
        ],
        country: [
          (v) => !!v || this.contentTransactionGuestDetails.name.rules.required,
        ],
      },
      isLoading: false,
      isLoadingOverlay: false,
      isError: false,
      uiContentLoaded: null,
      countries,
      currencies: null,
    };
  },
  watch: {
    showPaypal() {
      this.data.deposit = 100;
    },
    async selectedCurrency(curr) {
      this.isLoading = true;
      try {
        this.currencyRate = await getCurrencyRate(curr, this.$route.query.cid);
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
    await this.$store.dispatch("bookingEngine/getJourneyUi");
    this.uiContentLoaded = this.journeyUi;
  },
  async created() {
    this.isLoading = true;
    this.isLoadingOverlay = true;

    bus.$on("cart-transaction-updated", (cart) => {
      this.cart = cart;
    });

    this.cart = await idbGet(`cart.${this.$route.query.cid}`);
    this.userLanguage = this.getUserLanguage;

    await this.$store.dispatch(
      "bookingEngine/getHostel",
      this.cart.hostel_code,
    );

    const [hostelConf] = await Promise.all([find(this.cart.hostel_code)]);

    this.hostelConf = hostelConf;
    // this.hostel = hostel;
    this.hostel = this.hostelData;
    this.selectedCurrency = this.hostelConf.currency;

    this.currencies = getCurrencies(this.hostel.code);

    if (!this.isPaypalEnabled) this.data.payMethod = "card";
    this.data.deposit = this.cart.deposit_model_rate || 0;

    this.loading = false;
    this.isLoadingOverlay = false;
    this.isLoadingReservation = false;
  },
  mounted() {
    setTimeout(() => {
      if (this.$refs.transactionView) {
        this.$refs.transactionView.scrollIntoView();
      }
    });
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
    },
    showCurrencySelector() {
      return !["NOS"].includes(this.cart.hostel_code);
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
    stripeApiKey() {
      if (this.stripeKey) return this.stripeKey;
      if (!this.hostelData) return null;
      if (this.hostelConf.hostel_code === "COP")
        return "pk_test_51HcV22DcMXoM7M9zDYGv1smb0vkCgNqRE9RAoWwU2FvFaGbK9ukpEiWco3DerkKsSNrInwZKLLHraXjoe0kkwKna00vuwhlOu4";

      if (this.hostelConf.hostel_code === "NOS")
        return "pk_test_51INyuSHeze1xG3057GE0Dm9l61vY4l834jdngWTQUJO3daEhujhmBUG0sLsEtnRkxHFdnBjPZp2B0xgS5vIKPojH00nWvs0IGE";

      return "pk_test_97WWfDjUOsVWAzm3y1g8t0BJ00F4iyqoge";
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
        ? this.contentTransactionPaymentForm.s2.arrival
        : `Pay ${this.lowerDeposit}%`;
    },
    ...mapState("bookingEngine", ["journeyUi", "hostelData"]),
    ...mapGetters("bookingEngine", [
      "contentTheBreadCrumbs",
      "contentTransactionPanelHeaders",
      "contentTransactionGuestDetails",
      "contentTransactionPaymentForm",
      "getUserLanguage",
    ]),
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

      return confirm(this.contentTransactionPaymentForm.other.abandon);
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
          const transaction =
            await this.$refs.stripeContainer.createStripeTransaction();
          this.completeTransaction(transaction, "stripe");
        } else if (this.isSagepay) {
          const transaction =
            await this.$refs.sagepayContainer.createSagepayTransaction();
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
        this.reservation = await create(this.$route.query.cid, {
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

        await idbSet(`reservation.${this.$route.query.cid}`, this.reservation);
        await idbDel(`cart.${this.$route.query.cid}`);

        const path =
          window.location.pathname.replace("payment", "") + "confirmation";

        this.$router.push({
          path,
          query: {
            cid: this.$route.query.cid,
          },
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

<style>
#pay-method-btn .v-btn__content {
  width: 100%;
  white-space: normal;
}
</style>
