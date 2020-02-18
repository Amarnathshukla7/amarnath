<template>
  <v-app class="transaction-view">
    <v-overlay class="text-center" :value="isLoadingOverlay" :opacity="0.8">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
      <div style="max-width: 620px" class="heading mt-10 px-6">
        Please wait while we confirm your payment and booking. This might take
        up to 30 seconds or more on slow internet connections. Please be patient
      </div>
    </v-overlay>

    <v-overlay :value="isError" opacity=".8">
      <div class="title">Network Error</div>
      <div class="body-1">
        <span v-if="isPmsError">
          Issue occurred creating booking, please refresh this page and try
          again
        </span>
        <span v-else
          >Please check your connection and click below to try again</span
        >
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

      <v-row no-gutters>
        <v-col cols="12" md="8" lg="6" offset-lg="1" xl="5" offset-xl="2">
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
                              outlined=""
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Email"
                              :rules="rules.email"
                              v-model="data.guest.email"
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              label="Phone Number"
                              :rules="rules.phone"
                              v-model="data.guest.phone"
                              outlined=""
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-autocomplete
                              :items="countries"
                              label="Country"
                              :rules="rules.country"
                              v-model="data.guest.country"
                              outlined=""
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
                        @is-loading="state => (this.isLoading = state)"
                        @cart-updated="cart => (this.cart = cart)"
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
                                <v-col>
                                  <v-radio value="card">
                                    <div slot="label">
                                      Credit/Debit
                                      <img
                                        class="d-inline ml-3"
                                        width="96"
                                        src="../../assets/payment/card-icons1.svg"
                                      />
                                    </div>
                                  </v-radio>
                                </v-col>
                                <v-col>
                                  <v-radio
                                    v-if="isPaypalEnabled"
                                    value="paypal"
                                  >
                                    <div slot="label">
                                      PayPal
                                      <img
                                        class="d-inline ml-3"
                                        width="96"
                                        src="../../assets/payment/paypal-icon.svg"
                                      />
                                    </div>
                                  </v-radio>
                                </v-col>
                              </v-row>
                            </v-radio-group>
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
                                v-if="!showPaypal"
                                :value="0"
                                label="Pay on Arrival"
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
                              ref="stripeContainer"
                              :deposit="data.deposit"
                            ></stripe-form>
                          </v-col>
                        </v-row>
                        <v-row v-show="showPaypal" no-gutters>
                          <v-col cols="12">
                            <div
                              class="subtitle-1 text-left accent--text font-weight-bold"
                            >
                              3. PayPal
                            </div>
                          </v-col>
                          <v-col cols="12">
                            <paypal-form
                              :valid="valid"
                              :hostel="hostelConf"
                              :form-ref="$refs.form"
                              @show-validation-error="validate"
                              @paypal-approved="createPaypalReservation"
                            ></paypal-form>
                          </v-col>
                        </v-row>
                        <v-row no-gutters>
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
                              class="pt-12 pt-md-4 pb-8"
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
                      v-if="showCard"
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
                          <v-btn
                            class="font-weight-bold"
                            tile
                            large
                            py-2
                            color="secondary"
                            width="90%"
                            @click="cardReservation"
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
        <v-col cols="12" md="4" lg="4" xl="3" class="pl-4">
          <booking-summary
            :cart="cart"
            :currency="hostelConf.currency"
            :payable="payable"
          ></booking-summary>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar top v-model="formErrorSnackbar">
      Please check that all fields in the form are filled out correctly
      <v-btn text @click="formErrorSnackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Vue from "vue";
import VStripeElements from "v-stripe-elements/lib";
import BreadCrumbs from "../shared/BreadCrumbs.vue";
import BookingSummary from "./components/summary/Summary.vue";
import countries from "./data/countries.json";
import { formatPrice } from "../../filters/money";
import { create } from "./api/reservation-svc";

Vue.use(VStripeElements);

export default {
  components: {
    BreadCrumbs,
    BookingSummary,
    DiscountCode: () => import("./components/DiscountCode.vue"),
    PaypalForm: () => import("./components/PaypalForm.vue"),
    StripeForm: () => import("./components/StripeForm.vue"),
  },
  props: {
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
      formErrorSnackbar: false,
      reservation: null,
      valid: false,
      openPanels: [0, 1, 2],
      data: {
        terms: false,
        newsletter: false,
        deposit: 0,
        payMethod: "card",
        guest: {
          name: null,
          email: null,
          phone: null,
          country: null,
        },
      },
      rules: {
        email: [
          v => !!v || "E-mail is required",
          v => /.+@.+/.test(v) || "E-mail must be valid",
        ],
        name: [v => !!v || "Name is required"],
        terms: [v => !!v || "Please accept our terms"],
        phone: [v => !!v || "Phone Number is required"],
        country: [v => !!v || "Country is required"],
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
  computed: {
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
    showPaypal() {
      return this.isPaypalEnabled && this.data.payMethod === "paypal";
    },
    showCard() {
      return this.data.payMethod === "card";
    },
    breakfast() {
      return this.hostel.extras.find(extra => extra.fields.type === "breakfast")
        .fields;
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
    async createPaypalReservation(transaction) {
      this.isLoadingOverlay = true;

      this.reservation = await create({
        deposit: this.data.deposit,
        guest: this.data.guest,
        marketing: this.data.newsletter,
        transaction,
        gateway: "paypal",
      });

      this.isLoadingOverlay = false;

      if (this.reservation.status !== "success") {
        this.isError = true;
      }

      // if (reservation.status === 'success') {}
    },
    createSagepayReservation() {},
    async cardReservation() {
      if (!this.validate()) {
        this.formErrorSnackbar = true;
        return;
      }

      this.isLoadingOverlay = true;
      const transaction = await this.$refs.stripeContainer.createStripeReservation();
      const reservation = await create({
        deposit: this.data.deposit,
        guest: this.data.guest,
        transaction,
        gateway: "stripe",
        marketing: this.data.newsletter,
      });

      console.log(reservation);

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
