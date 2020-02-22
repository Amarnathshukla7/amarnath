<template>
  <main class="room-view">
    <v-overlay class="text-center" :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-overlay class="text-center" :value="isError" :opacity="0.8">
      <div class="title">Network Error</div>
      <div class="body-1 px-6">
        Please check your connection and click below to try again
      </div>
      <v-btn class="pt-4" icon @click="loadData">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-overlay>

    <v-container max-width="1400px">
      <v-row no-gutters>
        <v-col cols="12">
          <bread-crumbs />
        </v-col>

        <filters-sort-by />
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="8" lg="9">
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
        <v-col cols="12" md="4" lg="3" class="pl-4">
          <booking-summary
            :cost="totalCost"
            :cart-data="cart"
            :rooms-content="roomsContent"
            @update-cart="cart => (this.cart = cart)"
            @go-to-transaction="submitBooking"
          ></booking-summary>
        </v-col>
      </v-row>
      <breakdown-and-breakfast
        v-if="showSummaryBreakfast"
        :cart-data="cart"
        :rooms-content="roomsContent"
      ></breakdown-and-breakfast>
    </v-container>
  </main>
</template>

<script>
import Card from "./components/card/Card.vue";
import BookingSummary from "./components/summary/BookingSummary.vue";
import BreadCrumbs from "../shared/BreadCrumbs.vue";
import FiltersSortBy from "./components/filters/FiltersSortBy.vue";
import { availability } from "./api/search-svc";
import { create } from "./api/reservation-svc/cart-svc";
// import { bus } from "../../plugins/bus";

export default {
  props: {
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
    BreakdownAndBreakfast: () => import("./BreakdownAndBreakfast.vue"),
  },
  data() {
    return {
      openPanel: [0, 1],
      isLoading: false,
      isError: false,
      rooms: null,
      cart: null,
      showSummaryBreakfast: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.reset();
      this.isLoading = true;

      try {
        this.rooms = await availability(
          this.hostelCode,
          this.checkIn,
          this.checkOut,
        );
        await create("STC");
      } catch (e) {
        this.isError = true;
        console.log(e);
      }

      this.isLoading = false;
    },
    reset() {
      if (window) {
        window.scrollTo(0, 0);
      }
      this.rooms = null;
      this.cart = null;
      this.isError = false;
    },
    updateCart(cart) {
      this.cart = cart;
    },
    submitBooking() {
      if (this.isSmallDevice) {
        return;
      }

      window.scrollTo(0, 0);
      this.isLoading = true;
      this.$emit("go-to-view", "transaction", this.cart);
    },
  },
  computed: {
    isSmallDevice() {
      if (!window) return false;

      return window.innerWidth < 960;
    },
    roomsContent() {
      return this.hostel ? this.hostel.rooms : null;
    },
    dorms() {
      return this.rooms ? this.rooms.dorms : [];
    },
    privates() {
      return this.rooms ? this.rooms.privates : [];
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
