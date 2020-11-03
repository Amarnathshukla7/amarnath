<template>
  <v-app>
    <main ref="roomView" class="room-view">
      <RoomsOverlayLoading :loading="isLoading" />

      <RoomsOverlayError
        v-if="uiContentLoaded"
        :error="isError"
        :availability-error="availabilityError"
        :content="contentRoomsOverlayErrors"
        @close-overlay="closeErrorOverlay"
        @reload-data="loadData"
      />

      <RoomsSearchSummary
        v-if="uiContentLoaded"
        :hostel="hostelCode"
        :nights="nights"
        :arrival="checkIn"
        :departure="checkOut"
        :content="contentRoomsSearchSummary"
      />

      <TheBreadCrumbs v-if="uiContentLoaded" :content="contentTheBreadCrumbs" />

      <RoomsServerStatus
        v-if="uiContentLoaded"
        :is-status="isStatus"
        :status="status"
      />

      <RoomsModalGroupBookings
        v-if="uiContentLoaded && showGroupsModal"
        :show="showGroupsModal"
        :content="contentRoomsModalGroupBookings"
        @close-groups-modal="showGroupsModal = false"
      />

      <v-container v-if="hostel && hostelConf">
        <v-row v-show="!showSummaryBreakfast" no-gutters>
          <v-col cols="12" offset-xl="2">
            <RoomsOptionsSort
              :hostel-code="hostelCode"
              :content="contentRoomsOptions"
              @sort="sort"
            />
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
              <!-- MOBILE COVID MEASURES -->
              <TheCovidMeasures
                v-if="uiContentLoaded && bookingSource === 'STC'"
                class="hidden-sm-and-up"
                :content="contentTheCovidMeasures"
                :panel-header="contentRoomsExpansionHeaders.covid"
              />

              <!-- SHARED ROOMS -->
              <RoomsListingContainer
                :loading="isLoading"
                :panel-header="contentRoomsExpansionHeaders.shared"
                :rooms-array="dormRooms"
                :content-array="hostel.rooms"
                :check-in="checkIn"
                :check-out="checkOut"
                :min-stay="dormMinStay"
                :currency="currency"
                :deposit-model-rate="depositModelRate"
                :hostel-code="hostelCode"
                @update-local-cart="updateCart($event)"
                @cart-error="isError = true"
              />

              <!-- PRIVATE ROOMS -->
              <RoomsListingContainer
                :loading="isLoading"
                :panel-header="contentRoomsExpansionHeaders.private"
                :rooms-array="privateRooms"
                :content-array="hostel.rooms"
                :check-in="checkIn"
                :check-out="checkOut"
                :min-stay="privateMinStay"
                :currency="currency"
                :deposit-model-rate="depositModelRate"
                :hostel-code="hostelCode"
                @update-local-cart="updateCart($event)"
                @cart-error="isError = true"
              />
            </v-expansion-panels>
          </v-col>

          <v-col cols="12" sm="5" md="4" lg="3" xl="2">
            <RoomsBookingSummary
              :cost="totalCost"
              :cart-data="cart"
              :rooms-content="roomsContent"
              :currency="currency"
              :showSummaryBreakfast="showSummaryBreakfast"
              :hostel="hostel"
              :isSmallDevice="isSmallDevice"
              :ui-content="contentTheSummary"
              @update-cart="(cart) => (this.cart = cart)"
              @go-to-transaction="submitBooking"
              @back-to-rooms="showSummaryBreakfast = false"
              @guest-count="checkGuestModal"
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
import { mapState, mapGetters } from "vuex";
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
import RoomsBookingSummary from "../components/RoomsBookingSummary";
import TheBreadCrumbs from "../components/TheBreadCrumbs";
import TheCovidMeasures from "../components/TheCovidMeasures";
import RoomsOverlayError from "../components/RoomsOverlayError";
import RoomsOptionsSort from "../components/RoomsOptionsSort";
import RoomsListingContainer from "../components/RoomsListingContainer";
import RoomsModalGroupBookings from "../components/RoomsModalGroupBookings";
import RoomsOverlayLoading from "../components/RoomsOverlayLoading";
import RoomsSearchSummary from "../components/RoomsSearchSummary";
import RoomsServerStatus from "../components/RoomsServerStatus";

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
      default: "HMM",
    },
    checkIn: {
      type: String,
      default: "2021-02-02",
    },
    checkOut: {
      type: String,
      default: "2021-02-05",
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
    RoomsBookingSummary,
    TheBreadCrumbs,
    TheCovidMeasures,
    RoomsOverlayError,
    RoomsOptionsSort,
    RoomsListingContainer,
    RoomsModalGroupBookings,
    RoomsOverlayLoading,
    RoomsSearchSummary,
    RoomsServerStatus,
  },
  data() {
    return {
      depositModelRate: null,
      hostelConf: null,
      hostel: null,
      uiContentLoaded: null,
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
    dormRooms() {
      return this.rooms ? this.rooms.dorms : [];
    },
    dormMinStay() {
      return this.rooms ? this.rooms.minstays.dorm || null : null;
    },
    privateRooms() {
      return this.rooms ? this.rooms.privates : [];
    },
    privateMinStay() {
      return this.rooms ? this.rooms.minstays.private || null : null;
    },
    totalCost() {
      return this.cart ? this.cart.total_cost : 0;
    },
    ...mapGetters([
      "contentTheBreadCrumbs",
      "contentTheCovidMeasures",
      "contentTheSummary",
      "contentRoomsOverlayErrors",
      "contentRoomsSearchSummary",
      "contentRoomsModalGroupBookings",
      "contentRoomsOptions",
      "contentRoomsExpansionHeaders",
    ]),
    ...mapState(["journeyUi", "hostelData"]),
  },
  async beforeCreate() {
    await this.$store.dispatch("getJourneyUi");
    this.uiContentLoaded = this.journeyUi;
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
    closeErrorOverlay() {
      this.isError = false;
      this.availabilityError = false;
    },
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
