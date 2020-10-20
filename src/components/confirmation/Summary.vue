<template>
  <v-card tile class="other">
    <div
      class="white--text text-center accent px-4 py-8 font-weight-bold title mx-auto"
    >
      Your booking reference number is:
      <div class="display-1 font-weight-bold">
        {{ reservation.booking_reference }}
      </div>
    </div>
    <v-list-item class="py-2 pl-8 white">
      <v-list-item-content>
        <v-list-item-title>
          Accommodation Sub-Total
          <span class="float-right mr-6">{{
            reservation.cart.accommodation_cost
              | formatPrice(reservation.cart.hostel.currency)
          }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="py-2 pl-8 other">
      <v-list-item-content>
        <v-list-item-title>
          Loyalty Coupon Code
          <span class="float-right mr-6">{{
            reservation.cart.discount
              | formatPrice(reservation.cart.hostel.currency)
          }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="py-2 pl-8 white">
      <v-list-item-content>
        <v-list-item-title>
          Tourist Tax Total
          <span class="float-right mr-6">{{
            reservation.cart.tourist_tax_cost
              | formatPrice(reservation.cart.hostel.currency)
          }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      v-show="stc || reservation.cart.extras_cost > 0"
      class="py-2 pl-8 other"
    >
      <v-list-item-content>
        <v-list-item-title>
          Breakfast Total
          <span
            class="float-right mr-6"
            v-if="reservation.cart.extras_cost > 0"
          >
            {{
              reservation.cart.extras_cost
                | formatPrice(reservation.cart.hostel.currency)
            }}
          </span>
          <span class="float-right mr-6" v-else-if="noBreakfast">
            Not included in booking
          </span>
          <span class="float-right mr-6" v-else> Included for FREE! </span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="py-2 pl-8 accent">
      <v-list-item-content>
        <v-list-item-title class="white--text font-weight-bold">
          Total Price
          <span class="float-right mr-6">{{
            reservation.cart.total_cost
              | formatPrice(reservation.cart.hostel.currency)
          }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="py-2 pl-8 white">
      <v-list-item-content>
        <v-list-item-title>
          Total Paid
          <span class="float-right mr-6">{{
            reservation.paid | formatPrice(reservation.transaction.currency)
          }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="py-2 pl-8 accent font-weight-bold">
      <v-list-item-content>
        <v-list-item-title class="white--text">
          Due on arrival
          <span class="float-right mr-6">{{
            dueOnArrival | formatPrice(reservation.cart.hostel.currency)
          }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { formatPrice } from "../../filters/money";

export default {
  props: {
    reservation: {
      type: Object,
      required: true,
    },
  },
  filters: {
    formatPrice,
  },
  computed: {
    stc() {
      return (
        !this.reservation.cart.hostel.hostel_code ||
        !["COP", "NOS"].includes(this.reservation.cart.hostel.hostel_code)
      );
    },
    noBreakfast() {
      return ["PRA"].includes(this.reservation.cart.hostel.hostel_code);
    },
    dueOnArrival() {
      return (
        this.reservation.cart.total_cost -
        (this.reservation.cart.total_cost * this.reservation.deposit) / 100
      );
    },
  },
};
</script>
