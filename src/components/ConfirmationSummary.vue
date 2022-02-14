<template>
  <v-card id="confirmation-summary" tile class="other">
    <div
      class="white--text text-center accent px-4 py-8 font-weight-bold title mx-auto"
    >
      {{ contentConfirmationSummary.bookingReference }}:
      <div class="display-1 font-weight-bold">
        {{ reservation.booking_reference }}
      </div>
    </div>

    <v-list-item class="py-2 pl-8 white">
      <v-list-item-content>
        <v-list-item-title>
          <v-row no-gutters>
            <v-col cols="8">{{
              contentConfirmationSummary.accommodationTotal
            }}</v-col>
            <v-col cols="4">
              <span class="float-right mr-6">{{
                reservation.cart.accommodation_cost
                  | formatPrice(reservation.cart.hostel.currency)
              }}</span>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item class="py-2 pl-8 other" v-if="reservation.cart.discount > 0">
      <v-list-item-content>
        <v-list-item-title>
          <v-row no-gutters>
            <v-col cols="8">{{ contentConfirmationSummary.loyaltyCode }}</v-col>
            <v-col cols="4">
              <span class="float-right mr-6">{{
                reservation.cart.discount
                  | formatPrice(reservation.cart.hostel.currency)
              }}</span>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item class="py-2 pl-8 white">
      <v-list-item-content>
        <v-list-item-title>
          <v-row no-gutters>
            <v-col cols="8">{{ contentConfirmationSummary.touristTax }}</v-col>
            <v-col cols="4">
              <span class="float-right mr-6">{{
                reservation.cart.tourist_tax_cost
                  | formatPrice(reservation.cart.hostel.currency)
              }}</span>
            </v-col>
          </v-row>
          <!-- {{ contentConfirmationSummary.touristTax }}
          <span class="float-right mr-6">{{
            reservation.cart.tourist_tax_cost
              | formatPrice(reservation.cart.hostel.currency)
          }}</span> -->
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      v-show="stc || reservation.cart.extras_cost > 0"
      class="py-2 pl-8 other"
    >
      <v-list-item-content>
        <v-list-item-title>
          <v-row no-gutters>
            <v-col cols="7">{{
              contentConfirmationSummary.breakfast.heading
            }}</v-col>
            <v-col cols="5">
              <span
                class="float-right mr-6"
                v-if="reservation.cart.extras_cost > 0"
              >
                {{
                  reservation.cart.extras_cost
                    | formatPrice(reservation.cart.hostel.currency)
                }}
              </span>
              <span class="float-right text-right mr-6" v-else-if="noBreakfast">
                {{ contentConfirmationSummary.breakfast.notIncluded }}
              </span>
              <span class="float-right text-right mr-6" v-else>
                {{ contentConfirmationSummary.breakfast.included }}
              </span>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item class="py-2 pl-8 accent">
      <v-list-item-content>
        <v-list-item-title class="white--text font-weight-bold">
          <v-row no-gutters>
            <v-col cols="8">{{ contentConfirmationSummary.totalPrice }}</v-col>
            <v-col cols="4">
              <span class="float-right mr-6">{{
                reservation.cart.total_cost
                  | formatPrice(reservation.cart.hostel.currency)
              }}</span>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item class="py-2 pl-8 white">
      <v-list-item-content>
        <v-list-item-title>
          <v-row no-gutters>
            <v-col cols="8">{{ contentConfirmationSummary.totalPaid }}</v-col>
            <v-col cols="4">
              <span class="float-right mr-6">{{
                reservation.paid | formatPrice(reservation.transaction_currency)
              }}</span>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      class="py-2 pl-8 accent font-weight-bold"
      v-if="dueOnArrival > 0"
    >
      <v-list-item-content>
        <v-list-item-title class="white--text">
          <v-row no-gutters>
            <v-col cols="8">{{
              contentConfirmationSummary.dueOnArrival
            }}</v-col>
            <v-col cols="4">
              <span class="float-right mr-6">{{
                dueOnArrival | formatPrice(reservation.cart.hostel.currency)
              }}</span>
            </v-col>
          </v-row>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { formatPrice } from "../filters/money";
import { mapGetters } from "vuex";

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
    ...mapGetters("bookingEngine", ["contentConfirmationSummary"]),
  },
};
</script>

<style>
#confirmation-summary .v-list-item__title {
  white-space: normal;
}
</style>
