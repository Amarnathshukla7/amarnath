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
        :steps="viewOptions.steps"
        :current-step-key="viewOptions.currentStepKey"
        :content="contentTheBreadCrumbs"
      />

      <v-overlay v-model="showFailureModal" opacity=".95" class="text-center">
        <div class="title">Error</div>
        <div class="body-1 px-4">
          <div v-show="showReservationFailedModal || showUnknowErrorModal">
            <div style="max-width: 640px">
              Unable to complete reservation, either the room(s) or bed(s) have
              been booked already or our backend is having trouble. Please click
              the button below to go to the availability view and try again.
              <br />
              <br />
              <v-btn @click="redirectBackToRooms">Click Here</v-btn>
            </div>
          </div>
          <div v-show="showPaymentFailedModal">
            <div style="max-width: 640px">
              Your payment method didn't go through, no money has been taken
              from your accout. Please try again with a different payment
              method/option

              <br />
              <br />
              <v-btn
                @click="
                  showFailureModal = false;
                  showPaymentFailedModal = false;
                "
                >Click here to close this message</v-btn
              >
            </div>
          </div>
        </div>
      </v-overlay>

      <div v-if="hostel && hostelConf">
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
                          class="font-weight-bold white--text subtitle-2 text-uppercase"
                        >
                          Main Guest Details
                        </div>
                        <template v-slot:actions>
                          <v-icon color="white">$expand</v-icon>
                        </template>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content color="white">
                        <v-card class="mt-4" tile flat>
                          <component
                            :is="guestDetailsComponent"
                            v-bind="guestDetailsComponentProperties"
                          ></component>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <!-- END: MAIN GUEST DETAILS -->

                    <!-- COUPON CODE -->
                    <v-expansion-panel v-if="viewOptions.canApplyCouponCode">
                      <v-expansion-panel-header color="primary">
                        <div
                          class="font-weight-bold white--text subtitle-2 text-uppercase"
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

                    <v-expansion-panel
                      v-if="viewOptions.canSendConfirmationEmailToCustomer"
                    >
                      <v-expansion-panel-header color="primary">
                        <div
                          class="font-weight-bold white--text subtitle-2 text-uppercase"
                        >
                          Confirmation email
                        </div>
                        <template v-slot:actions>
                          <v-icon color="white">$expand</v-icon>
                        </template>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content color="white">
                        <v-checkbox v-model="data.guest.send_confirmation">
                          <label slot="label">
                            Send confirmation email to customer.
                          </label>
                        </v-checkbox>
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
                            contentTransactionPanelHeaders.transaction.payment
                          }}
                        </div>
                        <template v-slot:actions>
                          <v-icon color="white">$expand</v-icon>
                        </template>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content color="white">
                        <v-card class="mt-4" tile flat>
                          <v-row no-gutters v-if="hasMultiplePaymentMethods">
                            <v-col cols="12">
                              <div
                                class="subtitle-1 text-left accent--text font-weight-bold"
                              >
                                How would you like to pay?
                              </div>
                            </v-col>

                            <v-col cols="12">
                              <v-radio-group
                                v-model="data.payMethod"
                                class="payment-date"
                              >
                                <v-row>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="3"
                                    v-for="paymentMethod in enabledPaymentMethods"
                                    :key="paymentMethod.key"
                                  >
                                    <v-radio :value="paymentMethod.key">
                                      <img
                                        slot="label"
                                        height="24"
                                        :src="paymentMethod.imgSrc"
                                      />
                                    </v-radio>
                                  </v-col>

                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="3"
                                    v-if="
                                      viewOptions.digitalWalletEnabled &&
                                      isStripe
                                    "
                                  >
                                    <v-radio value="digital">
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

                          <v-row
                            v-if="
                              isPaymentMethodSelected &&
                              hasMultipleDepositRateOptions
                            "
                            no-gutters
                          >
                            <v-col cols="12">
                              <div
                                class="subtitle-1 text-left accent--text font-weight-bold"
                              >
                                <!-- When would you like to pay? -->
                                {{ contentTransactionPaymentForm.s2.question }}
                              </div>
                            </v-col>

                            <v-col cols="12">
                              <v-radio-group
                                v-model="data.deposit"
                                class="payment-date"
                              >
                                <v-radio
                                  v-for="depositRateOption in enabledDepositRateOptions"
                                  :key="depositRateOption.key"
                                  :value="depositRateOption.value"
                                  :label="depositRateOption.displayText"
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
                                class="subtitle-1 text-left accent--text font-weight-bold"
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
                                class="subtitle-1 text-left accent--text font-weight-bold"
                              >
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

                            <v-col
                              cols="12"
                              v-if="viewOptions.canOptInForMarketingNewsletter"
                            >
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
                                    :link="privacyPolicyLink"
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
                              Payable Now:
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
                              @wallet-enabled="
                                viewOptions.digitalWalletEnabled = true
                              "
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
                                Pay Now
                                {{
                                  payable
                                    | convertCurrency(currencyRate)
                                    | formatPrice(selectedCurrency)
                                }}
                              </span>
                              <span v-else>Confirm Booking</span>
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
              :parent-view-options="viewOptions"
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
      </div>

      <v-snackbar top v-model="formErrorSnackbar">
        Please check that all fields in the form are filled out correctly
        <v-btn text @click="formErrorSnackbar = false">Close</v-btn>
      </v-snackbar>
    </main>
  </v-app>
</template>

<script>
// Packages
import { mapGetters, mapState } from "vuex";
import { pick, keys } from "underscore";
import { getUserLocales } from "get-user-locale";

// import { set as idbSet, get as idbGet, del as idbDel } from "idb-keyval";
import VStripeElements from "v-stripe-elements/lib";
import Vue from "vue";
import VueLoadScript from "vue-load-script-plus";

// APIs
import { getCurrencyRate } from "../api/transaction/cart-svc";
import { create } from "../api/transaction/reservation-svc";
import { find as getHostel } from "../api/room/reservation-svc/hostel-svc";
import { getItems } from "../api/room/reservation-svc/cart-svc";

// Helpers, Plugins, Filters & Data
import { bus } from "../plugins/bus";
import { formatDate } from "../filters/date";
import { formatPrice, convertCurrency } from "../filters/money";
import { hostelShortName } from "../helpers/hostelNames";
import { getCurrencies } from "../data/currencies";
import TransactionViewOptions from "../config/transaction-view-options";
import { getBestLocale } from "../helpers/locale";

// Components
import BasicGuestDetailsForm from "../components/form/BasicGuestDetailsForm";
import LeadGuestDetailsForm from "../components/form/LeadGuestDetailsForm";
import TheBreadCrumbs from "../components/TheBreadCrumbs";
import TranslationWithAnchor from "../components/TranslationWithAnchor";
import TransactionSummary from "../components/TransactionSummary";
import TransactionFormDiscountCode from "../components/TransactionFormDiscountCode";
import TransactionOverlayError from "../components/TransactionOverlayError";
import TransactionOverlayLoading from "../components/TransactionOverlayLoading";
import TransactionSearchSummaryMobile from "../components/TransactionSearchSummaryMobile";
import TransactionFormPaymentPaypal from "../components/TransactionFormPaymentPaypal";
import TransactionFormPaymentStripeCard from "../components/TransactionFormPaymentStripeCard";
import TransactionFormPaymentStripePaymentRequest from "../components/TransactionFormPaymentStripePaymentRequest";

import {
  FLYINGPIG_TERMS_URL,
  COPENHAGENDOWNTOWN_TERMS_URL,
  STCHRISTOPHERS_INN_TERMS_URL,
  BEDS_AND_BARS_PRIVACY_URL,
} from "../config/external-links";
import { th } from "date-fns/locale";

Vue.use(VStripeElements);
Vue.use(VueLoadScript);

export default {
  components: {
    LeadGuestDetailsForm,
    BasicGuestDetailsForm,
    TheBreadCrumbs,
    TranslationWithAnchor,
    TransactionSummary,
    TransactionFormDiscountCode,
    TransactionOverlayError,
    TransactionOverlayLoading,
    TransactionSearchSummaryMobile,
    TransactionFormPaymentPaypal,
    TransactionFormPaymentStripeCard,
    TransactionFormPaymentStripePaymentRequest,
  },
  props: {
    viewOptions: {
      type: Object,
      default() {
        return TransactionViewOptions;
      },
    },
    stripeKey: {
      type: String,
      default: null,
    },
    cid: {
      type: String,
      required: true,
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
      formErrorSnackbar: false,
      reservation: null,
      valid: false,
      openPanels: [0, 1, 2],
      showFailureModal: false,
      showPaymentFailedModal: false,
      showReservationFailedModal: false,
      showUnknowErrorModal: false,
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
          send_confirmation: false,
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
        first_name: [(v) => !!v || "First name is required"],
        last_name: [(v) => !!v || "Last name is required"],
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
        this.currencyRate = await getCurrencyRate(this, curr, this.cid);
      } catch (error) {
        if (this.hostelConf.currency === curr) {
          this.currencyRate = 1;
        }

        this.selectedCurrency = this.hostelConf.currency;
      }
      this.isLoading = false;
    },
    cid() {
      this.isError = true;
      this.isLoadingOverlay = false;
    },
  },
  async beforeCreate() {
    if (this.$store.state.bookingEngine.userLanguage === "en-GB") {
      const browserLocaleCode = getBestLocale(getUserLocales());
      if (browserLocaleCode !== "en-GB") {
        this.$store.commit(
          "bookingEngine/SET_USER_LANGUAGE",
          browserLocaleCode,
        );
      }
    }
    await this.$store.dispatch("bookingEngine/getJourneyUi");
    this.uiContentLoaded = this.contentTheBreadCrumbs;
  },
  async created() {
    this.isLoading = true;
    this.isLoadingOverlay = true;

    bus.$on("cart-transaction-updated", (cart) => {
      this.cart = cart;
    });

    this.cart = await getItems(this, this.cid);
    this.userLanguage = this.getUserLanguage;

    await this.$store.dispatch(
      "bookingEngine/getHostel",
      this.cart.hostel_code,
    );

    const [hostelConf] = await Promise.all([
      getHostel(this, this.cart.hostel_code),
    ]);

    this.hostelConf = hostelConf;
    this.hostel = this.hostelData;
    this.selectedCurrency = this.hostelConf.currency;

    this.currencies = getCurrencies(this.hostel.code);

    if (!this.hasMultiplePaymentMethods) {
      this.data.payMethod = this.enabledPaymentMethods[0].key;
      console.info(
        `Only one payment method is available, set to ${this.data.payMethod}`,
      );
    }

    if (
      !this.hasMultipleDepositRateOptions &&
      this.enabledDepositRateOptions.length == 1
    ) {
      this.data.deposit = this.enabledDepositRateOptions[0].value;
      console.info(
        `Only one deposit rate option is available, set to ${this.data.deposit}`,
      );
    }

    this.loading = false;
    this.isLoadingOverlay = false;
    this.isLoadingReservation = false;

    console.info({ viewOptions: this.viewOptions });
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
    guestDetailsComponent() {
      console.info({ viewOptions: this.viewOptions });
      switch (this.viewOptions.guestDetailsFormComponent) {
        case "basic":
          return BasicGuestDetailsForm;
          break;
        case "lead":
          return LeadGuestDetailsForm;
          break;
        default:
          return BasicGuestDetailsForm;
      }
    },
    guestDetailsComponentProperties() {
      return {
        contentTransactionGuestDetails: this.contentTransactionGuestDetails,
        rules: this.rules,
        data: this.data,
      };
    },
    /**
     * Returns true if there is multiple payment options.
     */
    hasMultiplePaymentMethods() {
      return this.enabledPaymentMethods.length > 1;
    },
    /**
     * Returns the true if the selected payment method has multiple digital Wallet payment options
     * for the selected paymethod method.
     */
    hasMultipleDigitalWalletpaymentMethods() {
      return keys(digitalPaymentWalletOptions).length > 1;
    },
    hasDigitalWalletPaymentMethods() {
      return [];
    },
    /**
     * Returns list of enabled payment options.
     *
     * card: {
     * enabled: true,
     * imgSrc:
     *   "https://storage.googleapis.com/bedsandbars-images/card-icons1.02fa28e9.svg",
     * supportedDigitalWallets: {
     *   applePay: {
     *     imgSrc:
     *       "https://storage.googleapis.com/bedsandbars-images/card-icons1.02fa28e9.svg",
     *     enabled: true,
     *     conditions: () => /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
     *   },
     *   googlePay: {
     *     imgSrc:
     *       "https://storage.googleapis.com/bedsandbars-images/paypal-icon.580dc673.svg",
     *     enabled: true,
     *     conditions: () => /Safari/.test(navigator.userAgent) && /Apple Computer, Inc./.test(navigator.vendor)
     *   },
     *  },
     *  depositOptions: [
     *   {
     *      enabled: true,
     *      key: 'payOnArrival',
     *      displayText: '',
     *    },
     *    {
     *      enabled: true,
     *      key: 'payOnNow',
     *      displayText: '',
     *    },
     *  ],
     * },
     *
     * More information available on src/config/transaction-view-options.js
     */
    enabledPaymentMethods() {
      return this.viewOptions.gateways.filter(function (gateway) {
        return true === gateway.enabled;
      });
    },
    /**
     * Returns list of enabled digital wallet options for selected payment method.
     *
     * e.g.
     *
     *  applePay: {
     *     imgSrc:
     *      "https://storage.googleapis.com/bedsandbars-images/card-icons1.02fa28e9.svg",
     *     enabled: true,
     *     conditions: () => /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
     *   },
     * More informationa avialable on src/config/transaction-view-options.js
     */
    digitalPaymentWalletOptions() {
      if (!data.payMethod) {
        console.error("No payment method was selected");
      }

      const paymentMethod = this.enabledPaymentMethods[data.payMethod];

      return pick(paymentMethod.supportedDigitalWallets, function (
        supportedDigitalWallet,
        key,
        object,
      ) {
        return (
          supportedDigitalWallet.enabled === true &&
          supportedDigitalWallet.conditions === true
        );
      });
    },
    privacyPolicyLink() {
      return BEDS_AND_BARS_PRIVACY_URL;
    },
    termsLink() {
      if (["FPU", "FPD"].includes(this.hostelCode)) {
        return FLYINGPIG_TERMS_URL;
      } else if (this.hostel.code == "COP") {
        return COPENHAGENDOWNTOWN_TERMS_URL;
      } else {
        return STCHRISTOPHERS_INN_TERMS_URL;
      }
    },
    showCurrencySelector() {
      return !["NOS"].includes(this.cart.hostel_code);
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
    /**
     * Returns selected payment method options.
     */
    selectedPaymentMethodOptions() {
      return this.enabledPaymentMethods.filter((paymentMethod) => {
        return paymentMethod.key === this.data.payMethod;
      })[0];
    },
    hasMultipleDepositRateOptions() {
      return this.enabledDepositRateOptions.length > 1;
    },
    /**
     * Returns deposit options for selected payment method options, greater than the cart deposit model.
     */
    enabledDepositRateOptions() {
      if (!this.selectedPaymentMethodOptions) {
        return [];
      }

      return this.selectedPaymentMethodOptions.depositOptions.filter(
        (depositOption) => {
          return (
            depositOption.enabled &&
            depositOption.value >= parseInt(this.lowerDepositRate)
          );
        },
      );
    },
    isPaymentMethodSelected() {
      return this.data.payMethod != undefined || this.data.payMethod != null;
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
    lowerDepositRate() {
      return this.cart.deposit_model_rate;
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

      return confirm("Are you sure you want to abandon your search?");
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

          if (!transaction) {
            this.showPaymentFailedModal = true;
            this.showFailureModal = true;
            this.isLoadingOverlay = false;
            this.isLoadingReservation = false;
            return;
          }

          this.completeTransaction(transaction, "stripe");
        }
      } catch (e) {
        this.isError = true;
        this.isLoadingOverlay = false;
        this.isLoadingReservation = false;
      }
    },
    async completeTransaction(transaction, gateway, card = null) {
      try {
        this.reservation = await create(this, this.cid, {
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

        const path =
          window.location.pathname.replace("payment", "") + "confirmation";

        this.$router.push({
          path,
          query: {
            cid: this.cid,
          },
        });
      } catch (e) {
        if (e?.response) {
          this.handleReservationError(e);
        }

        this.isError = true;
        this.isLoadingOverlay = false;
        this.isLoadingReservation = false;
      }
    },
    async handleReservationError(e) {
      switch (e.response.status) {
        case 417:
          this.showReservationFailedModal = true;
          break;

        case 402:
          this.showPaymentFailedModal = true;
          break;

        default:
          this.showUnknowErrorModal = true;
          break;
      }

      this.showFailureModal = true;
    },
    async redirectBackToRooms() {
      await idbDel(`cart.${this.cid}`);

      const path =
        window.location.pathname.replace("payment", "") + "availability";

      this.$router.push({
        path,
        query: {
          cid: this.cid,
        },
      });
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
