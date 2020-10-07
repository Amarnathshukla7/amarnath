<template>
  <v-app>
    <main ref="roomView" class="room-view">
      <LoadingOverlay :loading="isLoading" />

      <ErrorOverlay
        v-if="uiContent"
        :error="isError"
        :availability-error="availabilityError"
      />

      <SearchSummary
        v-if="uiContent"
        :hostel="hostelCode"
        :nights="nights"
        :arrival="checkIn"
        :departure="checkOut"
      />

      <BreadCrumbs v-if="uiContent" />

      <Status v-if="uiContent" :is-status="isStatus" :status="status" />

      <GroupBookingsModal
        v-if="uiContent"
        :show="showGroupsModal"
        @hide="showGroupsModal = false"
      />

      <v-container v-if="hostel && hostelConf">
        <v-row v-show="!showSummaryBreakfast" no-gutters>
          <v-col cols="12" offset-xl="2">
            <FiltersSortBy :hostel-code="hostelCode" @sort="sort" />
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
            style="z-index: 0"
          >
            <v-expansion-panels
              v-model="openPanel"
              class="room-view-panel--margin"
              multiple
            >
              <CovidMeasures
                v-show="bookingSource === 'STC'"
                class="hidden-sm-and-up"
              />

              <v-expansion-panel>
                <v-expansion-panel-header color="primary">
                  <div
                    class="font-weight-bold white--text text-uppercase heading"
                  >
                    {{ journeyUi.expansionPanelHeaders.shared }}
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
                    {{ journeyUi.roomCard.cardLister.noAvailabilityDorms }}
                  </p>

                  <Card
                    v-for="dorm in dorms"
                    :room="dorm"
                    :room-contents="hostel.rooms"
                    :key="dorm.code"
                    :check-in="checkIn"
                    :check-out="checkOut"
                    :min-stay="dormMinStay"
                    :currency="currency"
                    :deposit-model-rate="depositModelRate"
                    :hostel-code="hostelCode"
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
                    {{ journeyUi.expansionPanelHeaders.private }}
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
                    {{ journeyUi.roomCard.cardLister.noAvailabilityPrivates }}
                  </p>

                  <Card
                    v-for="priv in privates"
                    :room="priv"
                    :room-contents="hostel.rooms"
                    :key="priv.code"
                    :check-in="checkIn"
                    :check-out="checkOut"
                    :min-stay="privateMinStay"
                    :currency="currency"
                    :deposit-model-rate="depositModelRate"
                    :hostel-code="hostelCode"
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
            <BookingSummary
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
            />
          </v-col>
        </v-row>
      </v-container>
    </main>
  </v-app>
</template>

<script>
// Packages
import { differenceInDays } from "date-fns";
import { mapState } from "vuex";
import { set } from "idb-keyval";

// APIs
import { availability } from "../api/room/search-svc";
import { create } from "../api/room/reservation-svc/cart-svc";
import { getStatus } from "../api/room/reservation-svc/status-svc";
import { find } from "../api/room/reservation-svc/hostel-svc";

// Helpers & Plugins
import { bus } from "../plugins/bus";
import { formatTimezone } from "../helpers/timezone";
import sortRooms from "../helpers/room/sort";

// Components
import BookingSummary from "../components/room/summary/BookingSummary";
import BreadCrumbs from "../components/shared/BreadCrumbs";
import Card from "../components/room/card/Card";
import CovidMeasures from "../components/shared/CovidMeasures";
import ErrorOverlay from "../components/room/overlay/ErrorOverlay";
import FiltersSortBy from "../components/room/filters/FiltersSortBy";
import GroupBookingsModal from "../components/room/groups/GroupBookingsModal";
import LoadingOverlay from "../components/room/overlay/LoadingOverlay";
import SearchSummary from "../components/room/search/SearchSummary";
import Status from "../components/room/status/Status";

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
    checkIn: {
      type: String,
      default: "2020-12-01",
    },
    checkOut: {
      type: String,
      default: "2020-12-03",
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
    BookingSummary,
    BreadCrumbs,
    Card,
    CovidMeasures,
    ErrorOverlay,
    FiltersSortBy,
    GroupBookingsModal,
    LoadingOverlay,
    SearchSummary,
    Status,
  },
  data() {
    return {
      depositModelRate: null,
      hostelConf: null,
      hostel: null,
      uiContent: null,
      showGroupsModal: false,
      groupBookingModalAlreadyShown: false,
      openPanel: [1, 2],
      isLoading: false,
      isError: false,
      isStatus: false,
      status: null,
      availabilityError: false,
      rooms: null,
      cart: null,
      showSummaryBreakfast: false,
    };
  },
  async beforeCreate() {
    await this.$store.dispatch("getJourneyUi");
    this.uiContent = this.journeyUi;
  },
  created() {
    this.loadData();

    bus.$on("cart-transaction-updated", (cart) => {
      this.cart = cart;
    });
  },
  mounted() {
    if (this.roomViewAnchorPoint === "roomView") {
      this.$refs.roomView.scrollIntoView();
    } else {
      const el = document.getElementById(this.roomViewAnchorPoint);
      if (el) el.scrollIntoView();
    }
  },
  methods: {
    async loadData() {
      if (this.isLoading) return;

      this.isLoading = true;
      this.reset();

      // this.$store.dispatch("getJourneyUi");

      const status = await getStatus();
      if (status.upgrading) {
        this.isStatus = true;
        this.status = status.message;
        this.isLoading = false;
        return;
      }

      try {
        this.$store.dispatch("getHostel", this.hostelCode);

        const [rooms, hostel] = await Promise.all([
          availability(this.hostelCode, this.checkIn, this.checkOut),
          find(this.hostelCode),
        ]);

        if (rooms.message && rooms.message === "unable to get availablity") {
          this.availabilityError = true;
          this.isLoading = false;
          return;
        }

        this.rooms = rooms;
        this.hostel = this.hostelData;
        this.hostelConf = hostel;
        const cart = await create(this.bookingSource);
        this.depositModelRate = cart.deposit_model_rate;
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
    async submitBooking(force = false) {
      this.$refs.roomView.scrollIntoView();

      if (this.isSmallDevice && !force && !this.showSummaryBreakfast) {
        this.showSummaryBreakfast = true;
        return;
      }

      this.isLoading = true;
      await set("cart", this.cart);
      console.log("cart");
      console.log(this.cart);

      this.$router.push({
        path: window.location.pathname.replace("availability", "") + "payment",
      });
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
      return differenceInDays(
        formatTimezone(new Date(this.checkOut)),
        formatTimezone(new Date(this.checkIn)),
      );
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
    ...mapState(["journeyUi", "hostelData"]),
  },
};
</script>

<style lang="scss">
.v-application .subtitle-1,
.v-application .headline,
.v-application .display-1 {
  font-family: $title-font, sans-serif !important;
}

.v-application .body-1,
.v-application .body-2,
.v-application .caption {
  font-family: $body-font-family, sans-serif !important;
}

.v-application {
  font-family: $body-font-family, sans-serif !important;

  .title {
    // To pin point specific classes of some components
    font-family: $title-font, sans-serif !important;
  }
}

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

@media screen and (min-width: 600px) {
  .v-expansion-panel--active:nth-child(2) {
    margin-top: 0px !important;
  }
}
</style>
