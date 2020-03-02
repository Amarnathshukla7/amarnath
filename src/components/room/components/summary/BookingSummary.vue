<template>
  <div class="desktop-summary accent">
    <v-expansion-panels v-model="open" tile flat class="hidden-sm-and-down">
      <v-expansion-panel>
        <v-expansion-panel-header color="primary">
          <div class="font-weight-bold white--text text-uppercase heading">
            Booking Summary
          </div>
          <template v-slot:actions>
            <v-icon color="white">$expand</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content color="info" class="pa-0">
          <v-card
            v-if="bookingEntries"
            flat
            tile
            color="info"
            class="pa-0 summary-card"
          >
            <booking-summary-item
              v-for="(room, index) in bookingEntries.normal"
              :key="room.code"
              :room="room"
              :index="index"
              @destroy-room="deleteFromCart"
            ></booking-summary-item>

            <booking-summary-item
              v-for="room in bookingEntries.custom"
              :key="`${room.code}-${room.checkIn}`"
              :room="room"
              @destroy-room="deleteFromCart"
            ></booking-summary-item>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card tile flat color="accent" class="white--text pt-4">
      <v-row no-gutters class="mb-5">
        <v-col cols="6">
          <div class="heading ml-6 mb-md-6 font-weight-bold">Total price:</div>
        </v-col>
        <v-col cols="6">
          <div class="heading text-right mr-6 font-weight-bold">
            {{ cost | formatPrice(currency) }}
          </div>
        </v-col>
      </v-row>
      <v-row v-if="!transaction" class="text-center" no-gutters>
        <v-col>
          <v-tooltip
            :disabled="!isCartUpdating && !isCartEmpty"
            open-on-hover
            open-on-click
            slot="append"
            bottom
          >
            <template v-slot:activator="{ on }">
              <div v-on="on">
                <v-btn
                  tile
                  height="64px"
                  color="secondary"
                  :disabled="isCartUpdating || isCartEmpty"
                  class="font-weight-bold heading white--text continue-btn"
                  @click="$emit('go-to-transaction')"
                >
                  <v-progress-circular
                    v-if="isCartUpdating"
                    indeterminate
                    color="white"
                  ></v-progress-circular>
                  <span v-if="!isCartUpdating">Confirm Selection</span>
                </v-btn>
              </div>
            </template>
            <span v-if="isCartUpdating"
              >Please hold on while we update your cart</span
            >
            <span v-if="isCartEmpty"
              >Please add a room/bed to your cart before continuing</span
            >
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { differenceInDays } from "date-fns";
import { formatPrice } from "../../../../filters/money";
import { formatDate } from "../../../../filters/date";
import { destroy } from "../../api/reservation-svc/cart-svc";
import { bus } from "../../../../plugins/bus";

import BookingSummaryItem from "./BookingSummaryItem.vue";

export default {
  props: {
    transaction: {
      type: Boolean,
      default: false,
    },
    cartData: {
      type: Object,
      default: null,
    },
    roomsContent: {
      type: Array,
      default: null,
    },
    currency: {
      type: String,
      default: "GBP",
    },
  },
  components: {
    BookingSummaryItem,
  },
  data() {
    return {
      open: 0,
      isCartUpdating: false,
    };
  },
  filters: {
    formatPrice,
    formatDate,
  },
  created() {
    bus.$on("cart-updating", state => (this.isCartUpdating = state));
  },
  methods: {
    async deleteFromCart(code, date) {
      try {
        this.isCartUpdating = true;
        this.cart = await destroy(code, date);
        bus.$emit("set-room-amount", code, this.oneDayBooking ? "" : date, 0);
      } catch (e) {
        console.log(e);
      }

      this.isCartUpdating = false;
    },
    normalBooking(rooms, roomContent) {
      return {
        name: roomContent.fields.name,
        code: rooms[0].code,
        checkIn: rooms[0].date,
        checkOut: rooms[rooms.length - 1].date,
        qty: rooms[0].qty,
        maxOccupancy: rooms[0].max_occupancy,
        type: roomContent.fields.type,
        cost: rooms
          .map(room => room.price_per_item * room.qty)
          .reduce((acc, val) => acc + val),
      };
    },
    customBooking(rooms, roomContent) {
      return rooms.map(room => ({
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
    cart: {
      get() {
        return this.cartData;
      },
      set(cart) {
        this.$emit("update-cart", cart);
      },
    },
    isCartEmpty() {
      return !(this.cart ? this.cart.items.length >= 1 : false);
    },
    cost() {
      if (!this.cart) return 0;

      return this.cart.total_cost;
    },
    oneDayBooking() {
      if (!this.cart) return;

      return differenceInDays(
        new Date(this.cart.check_out),
        new Date(this.cart.check_in),
      );
    },
    bookingEntries() {
      const normalBook = [];
      const customBook = [];

      if (!this.cart) return null;

      const items = this.cart.items;
      const roomCodes = new Set(
        items
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(room => room.code),
      );

      roomCodes.forEach(roomCode => {
        const rooms = items.filter(item => item.code === roomCode);
        let normal = true;

        const roomContent = this.roomsContent.find(
          room => room.fields.roomCode == roomCode,
        );

        rooms.forEach((room, idx) => {
          if (idx > 0) {
            const diff = differenceInDays(
              new Date(room.date),
              new Date(rooms[idx - 1].date),
            );

            const qtyDiff = room.qty === rooms[idx - 1].qty;

            if (diff !== 1 || !qtyDiff) normal = false;
          }
        });

        normal && rooms.length !== 1
          ? normalBook.push(this.normalBooking(rooms, roomContent))
          : customBook.push(...this.customBooking(rooms, roomContent));
      });

      return {
        normal: normalBook,
        custom: customBook.sort(
          (a, b) => new Date(a.checkIn) - new Date(b.checkIn),
        ),
      };
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
