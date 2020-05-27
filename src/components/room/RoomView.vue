<template>
  <main ref="roomView" class="room-view">
    <v-overlay class="text-center" :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-overlay
      class="text-center"
      :value="isError || availabilityError"
      :opacity="0.9"
      color="white"
    >
      <div
        v-if="availabilityError"
        class="headline black--text font-weight-bold mb-4"
      >
        Search Error
      </div>
      <div
        v-else-if="isError"
        class="headline black--text font-weight-bold mb-4"
      >
        Network Error
      </div>

      <div
        style="max-width: 600px; line-height: 2;"
        class="body-1 px-2 font-weight-bold black--text"
      >
        <span v-if="availabilityError">
          Uh oh! There's currently no availability for your selected dates.
          Please search for different dates or one of our other hostels.
        </span>
        <span v-else-if="isError">
          Please check your connection and click below to try again. If you see
          this error persistently, it might be because there's no rooms/beds
          available on your selected dates. Please click "Close", select new
          dates and click search again
        </span>
      </div>
      <v-btn class="mt-4 mr-4 font-weight-bold" @click="loadData">
        <v-icon>mdi-refresh</v-icon>
        Try Again
      </v-btn>
      <v-btn
        class="mt-4 font-weight-bold"
        @click="
          isError = false;
          availabilityError = false;
        "
      >
        <v-icon>mdi-close</v-icon>
        Close
      </v-btn>
    </v-overlay>

    <bread-crumbs />

    <group-bookings-modal
      :show="showGroupsModal"
      @hide="showGroupsModal = false"
    />

    <v-container>
      <v-row v-show="!showSummaryBreakfast" no-gutters>
        <v-col cols="12" offset-xl="2">
          <filters-sort-by @sort="sort" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-show="!showSummaryBreakfast"
          cols="12"
          sm="7"
          md="8"
          lg="9"
          xl="6"
          offset-xl="2"
          style="z-index: 0;"
        >
          <!-- cols="12" md="8" lg="6" offset-lg="1" xl="5" offset-xl="2" -->
          <v-expansion-panels
            v-model="openPanel"
            class="room-view-panel--margin"
            multiple
          >
            <v-expansion-panel>
              <v-expansion-panel-header color="primary">
                <div
                  class="font-weight-bold white--text text-uppercase heading"
                >
                  Shared Rooms
                </div>
                <template v-slot:actions>
                  <v-icon color="white">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content ref="sharedRooms" color="info">
                <p
                  v-if="!isLoading && dorms.length === 0"
                  class="heading font-weight-bold text-center mt-2"
                >
                  Nothing available
                </p>
                <card
                  v-for="dorm in dorms"
                  :room="dorm"
                  :room-contents="hostel.rooms"
                  :key="dorm.code"
                  :check-in="checkIn"
                  :check-out="checkOut"
                  :min-stay="dormMinStay"
                  :currency="currency"
                  @update-local-cart="updateCart"
                  @cart-error="isError = true"
                />

                <v-skeleton-loader
                  v-if="isLoading"
                  class="mx-auto mt-4"
                  type="card"
                ></v-skeleton-loader>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header color="primary">
                <div
                  class="font-weight-bold white--text text-uppercase heading"
                >
                  Private Rooms
                </div>
                <template v-slot:actions>
                  <v-icon color="white">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content ref="privateRooms" color="info">
                <p
                  v-if="!isLoading && privates.length === 0"
                  class="heading font-weight-bold text-center mt-2"
                >
                  Nothing available
                </p>
                <card
                  v-for="priv in privates"
                  :room="priv"
                  :room-contents="hostel.rooms"
                  :key="priv.code"
                  :check-in="checkIn"
                  :check-out="checkOut"
                  :min-stay="privateMinStay"
                  :currency="currency"
                  @update-local-cart="updateCart"
                  @cart-error="isError = true"
                />

                <v-skeleton-loader
                  v-if="isLoading"
                  class="mx-auto mt-4"
                  type="card"
                ></v-skeleton-loader>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12" sm="5" md="4" lg="3" xl="2">
          <booking-summary
            :cost="totalCost"
            :cart-data="cart"
            :rooms-content="roomsContent"
            :currency="currency"
            @update-cart="(cart) => (this.cart = cart)"
            @go-to-transaction="submitBooking"
            @back-to-rooms="showSummaryBreakfast = false"
            @guest-count="checkGuestModal"
            :showSummaryBreakfast="showSummaryBreakfast"
            :hostel="hostel"
            :isSmallDevice="isSmallDevice"
          ></booking-summary>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script>
import { differenceInDays } from "date-fns";
import Card from "./components/card/Card.vue";
import BookingSummary from "./components/summary/BookingSummary.vue";
import GroupBookingsModal from "./components/GroupBookingsModal.vue";
import BreadCrumbs from "../shared/BreadCrumbs.vue";
import FiltersSortBy from "./components/filters/FiltersSortBy.vue";
import { availability } from "./api/search-svc";
import { create } from "./api/reservation-svc/cart-svc";
import sortRooms from "./helpers/sort";
import { bus } from "../../plugins/bus";

export default {
  props: {
    roomViewAnchorPoint: {
      type: String,
      default: "roomView",
    },
    bookingSource: {
      type: String,
      default: "STC",
    },
    hostelCode: {
      type: String,
      default: "FPU",
    },
    hostelConf: {
      type: Object,
      defualt: null,
    },
    hostel: {
      type: Object,
      defualt: null,
    },
    checkIn: {
      type: String,
      default: null,
    },
    checkOut: {
      type: String,
      default: null,
    },
  },
  watch: {
    hostelCode() {
      this.loadData();
    },
    checkIn() {
      this.loadData();
    },
    checkOut() {
      this.loadData();
    },
  },
  components: {
    Card,
    BookingSummary,
    BreadCrumbs,
    FiltersSortBy,
    GroupBookingsModal,
  },
  data() {
    return {
      showGroupsModal: false,
      groupBookingModalAlreadyShown: false,
      openPanel: [0, 1],
      isLoading: false,
      isError: false,
      availabilityError: false,
      rooms: null,
      cart: null,
      showSummaryBreakfast: false,
    };
  },
  created() {
    this.loadData();

    bus.$on("cart-transaction-updated", (cart) => {
      this.cart = cart;
    });
  },
  mounted() {
    if (this.roomViewAnchorPoint) {
      const el = document.getElementById(this.roomViewAnchorPoint);
      if (el) el.scrollIntoView();
    } else {
      this.$refs.roomView.scrollIntoView();
    }
  },
  methods: {
    async loadData() {
      if (this.isLoading) return;

      this.isLoading = true;
      this.reset();

      try {
        const rooms = await availability(
          this.hostelCode,
          this.checkIn,
          this.checkOut,
        );

        if (rooms.message && rooms.message === "unable to get availablity") {
          this.availabilityError = true;
          this.isLoading = false;
          return;
        }

        this.rooms = rooms;
        await create(this.bookingSource);
      } catch (e) {
        console.log(e);
        this.isError = true;
      }

      this.isLoading = false;
    },
    reset() {
      if (this.$refs.roomView) {
        this.$refs.roomView.scrollIntoView();
      }
      this.rooms = null;
      this.cart = null;
      this.isError = false;
      this.availability = false;
    },
    updateCart(cart) {
      this.cart = cart;
    },
    submitBooking(force = false) {
      this.$refs.roomView.scrollIntoView();

      if (this.isSmallDevice && !force && !this.showSummaryBreakfast) {
        this.showSummaryBreakfast = true;
        return;
      }

      this.isLoading = true;
      this.$emit("go-to-view", "transaction", this.cart);
    },
    sort(type) {
      if (!type) return;

      const rooms = sortRooms[type](this.rooms);

      this.rooms = {
        ...rooms,
        ...this.rooms,
      };
    },
    checkGuestModal(guests) {
      if (!this.groupBookingModalAlreadyShown && guests >= 10) {
        this.groupBookingModalAlreadyShown = true;
        this.showGroupsModal = true;
      }
    },
  },
  computed: {
    currency() {
      return this.hostelConf ? this.hostelConf.currency : "GBP";
    },
    isSmallDevice() {
      if (!window) return false;

      return window.innerWidth < 600;
    },
    roomsContent() {
      return this.hostel ? this.hostel.rooms : null;
    },
    nights() {
      return differenceInDays(new Date(this.checkOut), new Date(this.checkIn));
    },
    dorms() {
      return this.rooms ? this.rooms.dorms : [];
    },
    dormMinStay() {
      return this.rooms ? this.rooms.minstays.dorm || null : null;
    },
    privates() {
      return this.rooms ? this.rooms.privates : [];
    },
    privateMinStay() {
      return this.rooms ? this.rooms.minstays.private || null : null;
    },
    totalCost() {
      return this.cart ? this.cart.total_cost : 0;
    },
  },
};
</script>

<style lang="scss">
.v-expansion-panel-content__wrap {
  padding: 0 12px 16px !important;
}

.theme--light.v-expansion-panels .v-expansion-panel {
  background-color: #f8f8f8 !important;
}

.v-expansion-panel-header {
  background-color: var(--v-primary-base);
}

.v-expansion-panels:not(.v-expansion-panels--accordion):not(.v-expansion-panels--tile)
  > .v-expansion-panel--next-active,
.v-expansion-panel-header v-expansion-panel-header--active {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-radius: 0 !important;
}

.room-view-panel--margin {
  margin-bottom: 125px;
}
</style>
