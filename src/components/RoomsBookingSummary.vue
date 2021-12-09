<template>
  <div class="desktop-summary-room">
    <v-btn
      class="mb-4"
      v-show="showSummaryBreakfast"
      @click="$emit('back-to-rooms')"
      width="100%"
      color="accent"
      outlined
    >
      {{ uiContent.ctas.backButton }}
    </v-btn>

    <v-expansion-panels
      v-show="showSummaryBreakfast || !isSmallDevice"
      v-model="open"
      tile
      flat
      multiple
      class=""
    >
      <TheCovidMeasures
        v-if="stc"
        :content="contentTheCovidMeasures"
        :panel-header="contentRoomsExpansionHeaders.covid"
      />

      <v-expansion-panel>
        <v-expansion-panel-header color="primary">
          <div class="font-weight-bold white--text text-uppercase heading">
            {{ uiContent.panelHeading }}
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
            outlined
            class="pa-0 summary-card"
          >
            <v-list-item class="py-2 pl-4 white">
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ hostelShortName(hostel.code) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>

          <v-card
            v-if="bookingEntries"
            flat
            tile
            color="info"
            class="pa-0 summary-card"
          >
            <RoomsBookingSummaryItem
              v-for="(room, index) in bookingEntries.normal"
              :key="room.code"
              :room="room"
              :index="index"
              :currency="currency"
              :language="language"
              @destroy-room="deleteFromCart"
            />

            <RoomsBookingSummaryItem
              v-for="(room, index) in bookingEntries.custom"
              :key="`${room.code}-${room.checkIn}`"
              :room="room"
              :index="index"
              :currency="currency"
              :language="language"
              @destroy-room="deleteFromCart"
            />

            <v-list-item v-show="stc && !showSummaryBreakfast" class="py-2">
              <v-list-item-content>
                <v-list-item-title>
                  <v-row no-gutters class="white-space-normal">
                    <v-col cols="7">
                      {{ uiContent.breakfast.headerStandard }}:
                    </v-col>
                    <v-col cols="5">
                      <span
                        v-if="noBreakfast"
                        class="float-right font-weight-bold text-end"
                      >
                        {{ uiContent.breakfast.notIncluded }}
                      </span>
                      <span
                        v-else
                        class="float-right font-weight-bold text-end"
                      >
                        {{ uiContent.breakfast.includedFree }}
                      </span>
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card v-if="showSummaryBreakfast" outlined tile class="mt-8">
      <v-list-item class="py-2 pl-8 white">
        <v-list-item-content>
          <v-list-item-title>
            {{ uiContent.accommSubTotal }}

            <span class="float-right mr-6">
              {{ cart.accommodation_cost | formatPrice(currency) }}
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-show="stc || cart.extras_cost > 0" class="py-2 pl-8 other">
        <v-list-item-content>
          <v-list-item-title>
            <v-row no-gutters class="white-space-normal">
              <v-col cols="7">{{ uiContent.breakfast.headerTotal }}</v-col>

              <v-col cols="5">
                <span
                  class="float-right mr-6 text-end"
                  v-if="cart.extras_cost > 0"
                >
                  {{ cart.extras_cost | formatPrice(currency) }}
                </span>

                <span class="float-right mr-6 text-end" v-else>
                  {{ uiContent.breakfast.includedFree }}
                </span>
              </v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card
      tile
      flat
      color="accent"
      class="white--text pt-4 total-price-room-summary"
    >
      <v-row no-gutters class="mb-5">
        <v-col cols="7">
          <div class="heading ml-6 mb-md-6 font-weight-bold">
            {{ uiContent.totalPrice }}:
          </div>
        </v-col>

        <v-col cols="5">
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

                  <span v-if="!isCartUpdating">
                    {{ uiContent.ctas.confirm }}
                  </span>
                </v-btn>
              </div>
            </template>

            <span v-if="isCartUpdating">
              {{ uiContent.cartMessages.updating }}
            </span>

            <span v-if="isCartEmpty">
              {{ uiContent.cartMessages.empty }}
            </span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card>

    <TransactionSummaryBreakfast
      v-if="breakfast && showSummaryBreakfast"
      :currency="currency"
      :content="breakfast"
      :hostel-code="hostel.code"
      :cid="this.cartData.token"
      class="breakfast--mobile"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { differenceInDays, addDays } from "date-fns";
import { formatPrice } from "../filters/money";
import { formatDate } from "../filters/date";
import { destroy as removeItem } from "../api/room/reservation-svc/cart-svc";
import { bus } from "../plugins/bus";
import RoomsBookingSummaryItem from "../components/RoomsBookingSummaryItem";
import TransactionSummaryBreakfast from "./TransactionSummaryBreakfast";
import { formatTimezone } from "../helpers/timezone";
import { hostelShortName } from "../helpers/hostelNames";
import TheCovidMeasures from "../components/TheCovidMeasures";
// import { get as idbGet, set as idbSet } from "idb-keyval";

export default {
  props: {
    isSmallDevice: {
      type: Boolean,
      default: false,
    },
    showSummaryBreakfast: {
      type: Boolean,
      default: false,
    },
    transaction: {
      type: Boolean,
      default: false,
    },
    cartData: {
      type: Object,
      default: null,
    },
    hostel: {
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
    language: {
      type: String,
      default: "en-GB",
    },
    uiContent: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    RoomsBookingSummaryItem,
    TransactionSummaryBreakfast,
    TheCovidMeasures,
  },
  watch: {
    bookingEntries(entries) {
      if (!entries) return;

      let guests = 0;

      const normalGuests = entries.normal
        .map((room) => room.maxOccupancy * room.qty)
        .reduce((total, num) => total + num, 0);

      guests += normalGuests;

      const customGuests = entries.custom
        .map((room) => room.maxOccupancy * room.qty)
        .reduce((total, num) => total + num, 0);

      guests += customGuests;

      this.$emit("guest-count", guests);

      entries.normal.forEach((room) => this.roomTypePopup(room.code, room.qty));
      entries.custom.forEach((room) => this.roomTypePopup(room.code, room.qty));
    },
  },
  data() {
    return {
      open: [1],
      isCartUpdating: false,
    };
  },
  filters: {
    formatPrice,
    formatDate,
  },
  created() {
    bus.$on("cart-updating", (state) => (this.isCartUpdating = state));
  },
  methods: {
    async deleteFromCart(code, date) {
      try {
        this.isCartUpdating = true;
        this.cart = await removeItem(this, code, date, this.cartData.token);
        // await idbSet(`cart.${this.$route.query.cid}`, this.cart);
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
    roomTypePopup(roomCode, qty) {
      const msg8bed = this.uiContent.roomTypeMessages.msg8Bed;
      const msg12bed = this.uiContent.roomTypeMessages.msg12Bed;
      const rooms = {
        1000118: {
          qty: 2,
          msg: msg8bed,
        },
        1000119: {
          qty: 4,
          msg: msg8bed,
        },
        1000122: {
          qty: 2,
          msg: msg12bed,
        },
        1000123: {
          qty: 8,
          msg: msg12bed,
        },
      };
      if (Object.keys(rooms).includes(roomCode) && qty > rooms[roomCode].qty) {
        // eslint-disable-next-line no-alert
        window.alert(rooms[roomCode].msg);
      }
    },
    hostelShortName,
  },
  computed: {
    stc() {
      return (
        !this.hostel.code || !["COP", "NOS", "PRA"].includes(this.hostel.code)
      );
    },
    noBreakfast() {
      return ["PRA"].includes(this.hostel.code);
    },
    cart: {
      get() {
        return this.cartData;
      },
      set(cart) {
        this.$emit("update-cart", cart);
      },
    },
    breakfast() {
      if (!this.hostel.extras) return null;

      return this.hostel.extras.find(
        (extra) => extra.fields.type === "breakfast",
      ).fields;
    },
    isCartEmpty() {
      return !(this.cart ? this.cart.items.length >= 1 : false);
    },
    cost() {
      if (!this.cart) return 0;

      return this.cart.total_cost || 0;
    },
    oneDayBooking() {
      if (!this.cart) return;

      return differenceInDays(
        formatTimezone(new Date(this.cart.check_out)),
        formatTimezone(new Date(this.cart.check_in)),
      );
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
    // ...mapState(["journeyUi"]),
    ...mapGetters("bookingEngine", [
      "contentTheCovidMeasures",
      "contentRoomsExpansionHeaders",
    ]),
  },
};
</script>

<style lang="scss">
.white-space-normal {
  white-space: normal;
}

.desktop-summary-room {
  .v-expansion-panel-content__wrap {
    padding: 0 !important;
  }

  .continue-btn {
    width: 100%;
  }

  .breakfast--mobile {
    margin-bottom: 150px;
  }

  @media (min-width: 960px) {
    .continue-btn {
      width: 85%;
      margin-bottom: 15px;
    }
  }
}

@media (max-width: 599px) {
  .total-price-room-summary {
    position: unset !important;
    position: fixed !important;
    z-index: 2;
    bottom: 0;
    top: unset;
    width: 100%;
    left: 0;
  }
}

@media (min-width: 599px) {
  .desktop-summary-room {
    position: sticky;
    top: 20px;
  }
}
</style>
