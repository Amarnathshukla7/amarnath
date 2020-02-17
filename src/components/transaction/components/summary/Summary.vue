<template>
  <div class="desktop-summary accent">
    <v-expansion-panels tile flat>
      <v-expansion-panel>
        <v-expansion-panel-header color="primary">
          <div class="font-weight-bold white--text text-uppercase heading">
            Your Booking
          </div>
          <template v-slot:actions>
            <v-icon color="white">$expand</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content color="info" class="pa-0">
          <v-card
            flat
            tile
            color="info"
            class="pa-0 summary-card"
            max-height="250"
          >
            <div class="cart-item-row">
              <v-row class="px-4 white">
                <v-col cols="8">
                  Accommodation Sub-Total
                </v-col>
                <v-col cols="4" class="text-right">
                  {{
                    cart.accommodation_cost | formatPrice(hostelConf.currency)
                  }}
                </v-col>
              </v-row>
              <v-row class="px-4">
                <v-col cols="8">
                  Loyalty Coupon Code
                </v-col>
                <v-col cols="4" class="text-right">
                  {{ cart.discount | formatPrice(hostelConf.currency) }}
                </v-col>
              </v-row>
              <v-row class="px-4 white">
                <v-col cols="8">
                  Tourist Tax Total
                </v-col>
                <v-col cols="4" class="text-right">
                  {{ cart.tourist_tax_cost | formatPrice(hostelConf.currency) }}
                </v-col>
              </v-row>
              <v-row class="px-4">
                <v-col cols="8">
                  Breakfast Total
                </v-col>
                <v-col cols="4" class="text-right">
                  {{ breakfastCost | formatPrice(hostelConf.currency) }}
                </v-col>
              </v-row>
              <v-row class="px-4 white">
                <v-col cols="8">
                  Breakfast Discount
                </v-col>
                <v-col cols="4" class="text-right">
                  -{{ breakfastCost | formatPrice(hostelConf.currency) }}
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card tile flat color="accent" class="">
      <v-row no-gutters class="white--text pt-4 hidden-md-and-down">
        <v-col cols="6">
          <div class="heading ml-6 mb-md-6 font-weight-bold">
            Payable Now:
          </div>
        </v-col>
        <v-col cols="6">
          <div class="heading text-right mr-6 font-weight-bold">
            {{ payable | formatPrice }}
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters class="white pt-4 hidden-md-and-down">
        <v-col cols="6">
          <div class="heading ml-6 mb-md-6 font-weight-bold">
            Due on arrival:
          </div>
        </v-col>
        <v-col cols="6">
          <div class="heading text-right mr-6 font-weight-bold">
            {{ dueOnArrival | formatPrice }}
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters class="white--text pt-4">
        <v-col cols="6">
          <div class="heading ml-6 mb-6 font-weight-bold">Total price:</div>
        </v-col>
        <v-col cols="6">
          <div class="heading text-right mr-6 font-weight-bold">
            {{ cost | formatPrice }}
          </div>
        </v-col>
      </v-row>
    </v-card>
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
    hostelConf: {
      type: Object,
      default: null,
    },
    payable: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isCartUpdating: false,
    };
  },
  filters: {
    formatPrice,
    formatDate,
  },
  computed: {
    isCartEmpty() {
      return !(this.cart ? this.cart.items.length >= 1 : false);
    },
    cost() {
      if (!this.cart) return 0;

      return this.cart.total_cost;
    },
    breakfastCost() {
      return this.cart.items
        .map(item => item.qty * item.max_occupancy * 399)
        .reduce((a, b) => a + b);
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
    overflow: scroll;
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
