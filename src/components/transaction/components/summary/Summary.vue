<template>
  <div class="desktop-summary-transaction">
    <v-expansion-panels v-model="open" tile flat class="d-none d-sm-block">
      <v-expansion-panel>
        <v-expansion-panel-header color="primary">
          <div class="font-weight-bold white--text text-uppercase heading">
            Your Booking
          </div>
          <template v-slot:actions>
            <v-icon color="white">$expand</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content color="other" class="pa-0">
          <v-card flat tile color="other" class="pa-0 summary-card">
            <v-list-item class="py-2 pl-4 white">
              <v-list-item-content>
                <v-list-item-title>
                  Accommodation Sub-Total
                  <span class="float-right">{{
                    cart.accommodation_cost | formatPrice(currency)
                  }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="py-2 pl-4 other">
              <v-list-item-content>
                <v-list-item-title>
                  Loyalty Coupon Code
                  <span class="float-right">{{
                    discount | formatPrice(currency)
                  }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="py-2 pl-4 white">
              <v-list-item-content>
                <v-list-item-title>
                  Tourist Tax Total
                  <span class="float-right">{{
                    cart.tourist_tax_cost | formatPrice(currency)
                  }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-show="stc || breakfastCost > 0"
              class="py-2 pl-4 other"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Breakfast Total
                  <span class="float-right" v-if="breakfastCost > 0">
                    {{ breakfastCost | formatPrice(currency) }}
                  </span>
                  <span class="float-right" v-else>
                    Included for FREE!
                  </span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card tile flat color="accent" class="">
      <v-row class="hidden-sm-and-down px-4 py-2 font-weight-bold white--text">
        <v-col cols="8">
          Payable Now:
        </v-col>
        <v-col cols="4" class="text-right">
          {{
            payable
              | convertCurrency(selectedCurrencyRate)
              | formatPrice(selectedCurrency)
          }}
        </v-col>
      </v-row>
      <v-row class="hidden-md-and-down px-4 py-2 white">
        <v-col cols="8">
          Due on arrival:
        </v-col>
        <v-col cols="4" class="text-right">
          {{ dueOnArrival | formatPrice(currency) }}
        </v-col>
      </v-row>
      <v-row class="px-4 py-2 white--text">
        <v-col cols="6" offset-md="0">
          <div class="title font-weight-bold">Total price:</div>
          <div class="subtitle-1 font-weight-bold hidden-md-and-up">
            Payable Now:
          </div>
        </v-col>
        <v-col cols="6" class="text-right">
          <div class="title font-weight-bold">
            {{ cost | formatPrice(currency) }}
          </div>
          <div class="subtitle-1 font-weight-bold hidden-md-and-up">
            {{
              payable
                | convertCurrency(selectedCurrencyRate)
                | formatPrice(selectedCurrency)
            }}
          </div>
        </v-col>
      </v-row>
    </v-card>
    <breakfast
      v-if="breakfast"
      :content="breakfast"
      :currency="currency"
      :hostel-code="cart.hostel_code"
      class="hidden-md-and-down"
    />
  </div>
</template>

<script>
import { formatPrice, convertCurrency } from "../../../../filters/money";
import { formatDate } from "../../../../filters/date";

import Breakfast from "./Breakfast.vue";

export default {
  props: {
    breakfast: {
      type: Object,
      default: null,
    },
    cart: {
      type: Object,
      default: null,
    },
    currency: {
      type: String,
      default: "GBP",
    },
    selectedCurrencyRate: {
      type: Number,
      default: 1,
    },
    selectedCurrency: {
      type: String,
      default: "GBP",
    },
    payable: {
      type: Number,
      default: 0,
    },
  },
  components: {
    Breakfast,
  },
  data() {
    return {
      open: 0,
      isCartUpdating: false,
      breakfasts: 0,
    };
  },
  filters: {
    formatPrice,
    formatDate,
    convertCurrency,
  },
  methods: {
    increment() {},
    decrement() {},
  },
  computed: {
    isCartEmpty() {
      return !(this.cart ? this.cart.items.length >= 1 : false);
    },
    stc() {
      return (
        !this.cart.hostel_code ||
        !["COP", "NOS"].includes(this.cart.hostel_code)
      );
    },
    discount() {
      return this.cart.discount;
    },
    cost() {
      if (!this.cart) return 0;

      return this.cart.total_cost;
    },
    breakfastCost() {
      return this.cart.extras_cost;
    },
    dueOnArrival() {
      return this.cost - this.payable;
    },
  },
};
</script>

<style lang="scss">
.desktop-summary-transaction {
  .v-expansion-panel-content__wrap {
    padding: 0 !important;
  }

  .continue-btn {
    width: 100%;
  }

  @media (min-width: 960px) {
    .continue-btn {
      width: 85%;
      margin-bottom: 15px;
    }
  }

  position: sticky;
  top: 20px;
}

@media (max-width: 600px) {
  .desktop-summary-transaction {
    // position: unset;
    position: fixed;
    z-index: 2;
    bottom: 0;
    top: unset;
    width: 100%;
    left: 0;
  }
}
</style>
