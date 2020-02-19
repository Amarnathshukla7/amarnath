<template>
  <div class="desktop-summary">
    <v-expansion-panels v-model="open" class="hidden-md-and-down" tile flat>
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
            <div class="cart-item-row">
              <v-row class="px-4 py-2 white">
                <v-col cols="8">
                  Accommodation Sub-Total
                </v-col>
                <v-col cols="4" class="text-right">
                  {{ cart.accommodation_cost | formatPrice(currency) }}
                </v-col>
              </v-row>
              <v-row class="px-4 py-2">
                <v-col cols="8">
                  Loyalty Coupon Code
                </v-col>
                <v-col cols="4" class="text-right">
                  − {{ discount | formatPrice(currency) }}
                </v-col>
              </v-row>
              <v-row class="px-4 py-2 white">
                <v-col cols="8">
                  Tourist Tax Total
                </v-col>
                <v-col cols="4" class="text-right">
                  {{ cart.tourist_tax_cost | formatPrice(currency) }}
                </v-col>
              </v-row>
              <v-row class="px-4 py-2">
                <v-col cols="6">
                  Breakfast Total
                </v-col>
                <v-col cols="6" class="text-right">
                  <span v-if="breakfastCost > 0">
                    {{ breakfastCost | formatPrice(currency) }}
                  </span>
                  <span v-else>
                    Included for FREE!
                  </span>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card tile flat color="accent" class="">
      <v-row class="hidden-md-and-down px-4 py-2 white--text">
        <v-col cols="8">
          Payable Now:
        </v-col>
        <v-col cols="4" class="text-right">
          {{ payable | formatPrice(currency) }}
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
        <v-col cols="6" offset="1" md="8" offset-md="0">
          <div class="title font-weight-bold">Total price:</div>
          <div class="subtitle-1 font-weight-bold hidden-md-and-up">
            Payable Now:
          </div>
        </v-col>
        <v-col cols="4" class="text-right">
          <div class="title font-weight-bold">
            {{ cost | formatPrice(currency) }}
          </div>
          <div class="subtitle-1 font-weight-bold hidden-md-and-up">
            {{ payable | formatPrice(currency) }}
          </div>
        </v-col>
      </v-row>
    </v-card>
    <breakfast class="hidden-md-and-down" />
  </div>
</template>

<script>
import { formatPrice } from "../../../../filters/money";
import { formatDate } from "../../../../filters/date";

export default {
  props: {
    cart: {
      type: Object,
      default: null,
    },
    currency: {
      type: String,
      default: "GBP",
    },
    payable: {
      type: Number,
      default: 0,
    },
  },
  components: {
    Breakfast: () => import("./Breakfast.vue"),
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
  },
  methods: {
    increment() {},
    decrement() {},
  },
  computed: {
    isCartEmpty() {
      return !(this.cart ? this.cart.items.length >= 1 : false);
    },
    discount() {
      return this.cart.discount;
    },
    cost() {
      if (!this.cart) return 0;

      return this.cart.total_cost;
    },
    breakfastCost() {
      return 0;
    },
    dueOnArrival() {
      return this.cost - this.payable;
    },
  },
};
</script>

<style lang="scss">
.desktop-summary {
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

  .summary-card {
    overflow-y: scroll;
  }

  position: sticky;
  top: 20px;
}

@media (max-width: 960px) {
  .desktop-summary {
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
