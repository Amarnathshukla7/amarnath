<template>
  <div>
    <!-- <v-btn
      @click="$emit('show-rooms')"
      color="secondary"
      tile
      large
      depressed
      class="mb-2"
    >
      <v-icon left>mdi-chevron-left</v-icon>
      Back
    </v-btn> -->
    <booking-summary
      :cart-data="cart"
      :rooms-content="hostel.rooms"
      :currency="currency"
      @go-to-transaction="$emit('go-to-transaction', true)"
    ></booking-summary>
    <v-card outlined tile class="mt-8">
      <v-list-item class="py-2 pl-8 white">
        <v-list-item-content>
          <v-list-item-title>
            Accommodation Sub-Total
            <span class="float-right mr-6">{{
              cart.accommodation_cost | formatPrice(currency)
            }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="py-2 pl-8 other">
        <v-list-item-content>
          <v-list-item-title>
            Breakfast Total
            <span class="float-right mr-6" v-if="cart.extras_cost > 0">
              {{ cart.extras_cost | formatPrice(currency) }}
            </span>
            <span class="float-right mr-6" v-else>
              Included for FREE!
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <breakfast
      v-if="breakfast"
      :content="breakfast"
      :currency="currency"
      style="margin-bottom: 150px;"
    />
  </div>
</template>

<script>
import { bus } from "../../plugins/bus";
import { formatPrice } from "../../filters/money";

export default {
  props: {
    cart: {
      type: Object,
      default: null,
    },
    hostel: {
      type: Object,
      default: null,
    },
    currency: {
      type: String,
      default: "GBP",
    },
  },
  components: {
    Breakfast: () => import("../transaction/components/summary/Breakfast"),
    BookingSummary: () => import("./components/summary/BookingSummary"),
  },
  filters: {
    formatPrice,
  },
  data() {
    return {
      isCartUpdating: false,
      dialog: true,
      open: 0,
    };
  },
  computed: {
    totalCost() {
      return this.cart.total_cost;
    },
    breakfast() {
      if (!this.hostel.extras) return null;

      return this.hostel.extras.find(extra => extra.fields.type === "breakfast")
        .fields;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-mobile-fixed-bottom {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
}
</style>
