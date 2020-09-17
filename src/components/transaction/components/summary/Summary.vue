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
            <v-list class="pa-0">
              <v-list-item class="py-2 pl-4 other">
                <v-list-item-content>
                  <v-list-item-subtitle
                    class="body-1 mb-2 font-weight-bold accent--text"
                  >
                    {{ cart.check_in | formatDate }} -
                    {{ cart.check_out | formatDate }}
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    {{ hostelShortName(cart.hostel_code) }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- <v-list-item class="py-2 pl-4 white">
                <v-list-item-content>
                  <v-list-item-title>
                    Accommodation Sub-Total
                    <span class="float-right">{{
                      cart.accommodation_cost | formatPrice(currency)
                    }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item> -->

              <v-list-group sub-group>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      Accommodation Sub-Total
                      <span class="float-right">{{
                        cart.accommodation_cost | formatPrice(currency)
                      }}</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-card flat tile color="info" class="pa-0 summary-card">
                  <AccommodationSummaryItem
                    v-for="(room, index) in bookingEntries.normal"
                    :key="index"
                    :room="room"
                    :currency="currency"
                  />
                  <AccommodationSummaryItem
                    v-for="(room, index) in bookingEntries.custom"
                    :key="index"
                    :room="room"
                    :currency="currency"
                  />
                </v-card>
              </v-list-group>

              <v-list-item class="py-2 pl-4 other">
                <v-list-item-content>
                  <v-list-item-title>
                    Loyalty Coupon Code

                    <span class="float-right">
                      <span v-show="discount > 0">- </span>
                      {{ discount | formatPrice(currency) }}
                    </span>
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
                    <span class="float-right" v-else-if="noBreakfast">
                      not included
                    </span>
                    <span class="float-right" v-else> Included for FREE! </span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card tile flat color="accent" class="">
      <v-row class="hidden-sm-and-down px-4 py-2 font-weight-bold white--text">
        <v-col cols="8"> Payable Now: </v-col>
        <v-col cols="4" class="text-right">
          {{
            payable
              | convertCurrency(selectedCurrencyRate)
              | formatPrice(selectedCurrency)
          }}
        </v-col>
      </v-row>
      <v-row class="hidden-md-and-down px-4 py-2 white">
        <v-col cols="8"> Due on arrival: </v-col>
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
import { formatTimezone } from "../../../../helpers/timezone";
import { differenceInDays, addDays } from "date-fns";
import { hostelShortName } from "../../../../helpers/hostelNames";
import AccommodationSummaryItem from "./AccommodationSummaryItem";

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
    deposit: {
      type: Number,
      default: 0,
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
    roomsContent: {
      type: Array,
      default: null,
    },
  },
  components: {
    Breakfast,
    AccommodationSummaryItem,
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
    hostelShortName,
  },
  methods: {
    increment() {},
    decrement() {},
    hostelShortName: hostelShortName,
    normalBooking(rooms, roomContent) {
      return {
        name: roomContent.fields.name,
        code: rooms[0].code,
        checkIn: rooms[0].date,
        checkOut: addDays(new Date(rooms[rooms.length - 1].date), 1),
        qty: rooms[0].qty,
        maxOccupancy: rooms[0].max_occupancy,
        type: roomContent.fields.type,
        cost: rooms
          .map((room) => room.price_per_item * room.qty)
          .reduce((acc, val) => acc + val),
      };
    },
    customBooking(rooms, roomContent) {
      return rooms.map((room) => ({
        name: roomContent.fields.name,
        code: room.code,
        checkIn: room.date,
        qty: room.qty,
        maxOccupancy: room.max_occupancy,
        type: roomContent.fields.type,
        cost: room.price_per_item * room.qty,
      }));
    },
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
    noBreakfast() {
      return ["PRA"].includes(this.cart.hostel_code);
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
      if (this.deposit === 100) return 0;

      return this.cost;
    },
    bookingEntries() {
      const normalBook = [];
      const customBook = [];

      const guestCount = 0;

      if (!this.cart) return null;

      const items = this.cart.items;
      const roomCodes = new Set(
        items
          .sort(
            (a, b) =>
              formatTimezone(new Date(a.date)) -
              formatTimezone(new Date(b.date)),
          )
          .filter((room) => room.type === "bed")
          .map((room) => room.code),
      );

      roomCodes.forEach((roomCode) => {
        const rooms = items.filter((item) => item.code === roomCode);
        let normal = true;

        const roomContent = this.roomsContent.find(
          (room) => room.fields.roomCode == roomCode,
        );

        rooms.forEach((room, idx) => {
          if (idx > 0) {
            const diff = differenceInDays(
              formatTimezone(new Date(room.date)),
              formatTimezone(new Date(rooms[idx - 1].date)),
            );

            const qtyDiff = room.qty === rooms[idx - 1].qty;

            if (diff !== 1 || !qtyDiff) normal = false;
          }
        });

        if (normal && rooms.length !== 1) {
          normalBook.push(this.normalBooking(rooms, roomContent));
        } else {
          customBook.push(...this.customBooking(rooms, roomContent));
        }
      });

      return {
        normal: normalBook,
        custom: customBook.sort(
          (a, b) =>
            formatTimezone(new Date(a.checkIn)) -
            formatTimezone(new Date(b.checkIn)),
        ),
      };
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
