<template>
  <v-app class="room-view">
    <v-overlay :value="isLoadingOverlay">
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

      <v-row no-gutters>
        <v-col cols="12" md="8" lg="9">
          <v-form ref="form" @submit.prevent>
            <v-row no-gutters>
              <v-col cols="12">
                <v-expansion-panels v-model="openPanels" multiple>
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
                          v-model="data.guest.name"
                          outlined=""
                        ></v-text-field>
                        <v-text-field
                          label="Email"
                          :rules="rules.email"
                          v-model="data.guest.email"
                          outlined
                        ></v-text-field>
                        <v-text-field
                          label="Phone Number"
                          :rules="rules.phone"
                          v-model="data.guest.phone"
                          outlined=""
                        ></v-text-field>
                        <v-autocomplete
                          :items="countries"
                          label="Country"
                          :rules="rules.country"
                          v-model="data.guest.country"
                          outlined=""
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
                      <discount-code
                        :is-loading="isLoading"
                        @is-loading="state => (this.isLoading = state)"
                      ></discount-code>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel class="mb-12">
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
                              <v-radio
                                value="card"
                                label="Credit/Debit"
                              ></v-radio>
                              <v-radio
                                v-if="isPaypalEnabled"
                                value="paypal"
                                label="PayPal"
                              ></v-radio>
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
                        <v-row v-show="showCard">
                          <v-col cols="12">
                            <v-btn
                              class="font-weight-bold white--text subtitle-1"
                              large
                              width="100%"
                              color="secondary"
                              :disabled="isLoading"
                              @click="cardReservation"
                            >
                              <span v-if="payable > 0"
                                >Pay
                                {{
                                  payable | formatPrice(hostelConf.currency)
                                }}</span
                              >
                              <span v-else>Confirm Booking</span>
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
        </v-col>
        <v-col cols="12" md="4" lg="3" class="pl-4">
          <booking-summary
            :transaction="true"
            :cost="totalCost"
            :cart-data="cart"
            :rooms-content="roomsContent"
            @update-cart="cart => (this.cart = cart)"
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
import BookingSummary from "../room/components/summary/BookingSummary.vue";
import countries from "./data/countries.json";
import { formatPrice } from "../../filters/money";
import { deposit } from "./api/cart-svc";
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
    data: {
      handler() {
        console.log(
          Object.values(this.$refs.form.errorBag).every(bool => bool === false),
        );
        this.valid = Object.values(this.$refs.form.errorBag).every(
          bool => bool === false,
        );
      },
      deep: true,
    },
    "data.deposit": {
      async handler(val) {
        this.isLoading = true;
        await deposit(val);
        this.isLoading = false;
      },
      deep: true,
    },
    showPaypal() {
      this.data.deposit = 100;
    },
  },
  computed: {
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
      const reservation = await create({
        guest: this.data.guest,
        transaction,
        gateway: "paypal",
      });

      console.log(reservation);
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
        guest: this.data.guest,
        transaction,
        gateway: "stripe",
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

<style lang="scss" scoped></style>
