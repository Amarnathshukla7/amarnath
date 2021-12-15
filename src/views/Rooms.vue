<template>
  <v-app>
    <main ref="roomView" class="room-view">
      <RoomsOverlayLoading :loading="isLoading" />

      <RoomsOverlayError
        v-if="uiContentLoaded"
        :error="isError"
        :availability-error="availabilityError"
        :content="contentRoomsOverlayErrors"
        :hostel-code="hostelCode"
        @close-overlay="closeErrorOverlay"
        @reload-data="reloadAvailability"
      />

      <TheBreadCrumbs
        :steps="viewOptions.steps"
        :current-step-key="viewOptions.currentStepKey"
        :content="contentTheBreadCrumbs"
      />

      <RoomsSearchSummary
        v-if="uiContentLoaded"
        :hostel="hostelCode"
        :nights="nights"
        :arrival="checkIn"
        :departure="checkOut"
        :language="userLanguage"
        :content="contentRoomsSearchSummary"
      />

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

      <div v-if="hostel && hostelConf">
        <v-row
          class="language-picker-and-room-options"
          v-show="!showSummaryBreakfast"
          no-gutters
        >
          <v-col cols="10" sm="11" xl="8">
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
                :cid="cid"
                :loading="isLoading"
                :panel-header="contentRoomsExpansionHeaders.shared"
                :rooms-array="dormRooms"
                :content-array="hostel.rooms"
                :check-in="checkIn"
                :check-out="checkOut"
                :min-stay="dormMinStay"
                :currency="currency"
                :language="userLanguage"
                :deposit-model-rate="depositModelRate"
                :hostel-code="hostelCode"
                @update-local-cart="updateCart($event)"
                @cart-error="isError = true"
              />

              <!-- PRIVATE ROOMS -->
              <RoomsListingContainer
                :cid="cid"
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
              :language="userLanguage"
              :ui-content="contentTheSummary"
              @update-cart="(cart) => (this.cart = cart)"
              @go-to-transaction="submitBooking"
              @back-to-rooms="showSummaryBreakfast = false"
              @guest-count="checkGuestModal"
            />
          </v-col>
        </v-row>
      </div>
    </main>
  </v-app>
</template>

<script>
/**
 * This is the initial page the user lands to start the booking journey.
 * 1. Make sure the cid query parameter is attached to the page.
 * 2. When the cid is updated make sure a new cart is created and exisiting cart is replaced with new one, use the props to pass updates.
 */
// Packages
import { differenceInDays } from "date-fns";
import { mapGetters } from "vuex";
import { getUserLocales } from "get-user-locale";

// APIs
import { availability as getAvailability } from "../api/room/search-svc";
import {
  create as createCart,
  getItems as getCartItems,
  getCart,
} from "../api/room/reservation-svc/cart-svc";
import { getStatus } from "../api/room/reservation-svc/status-svc";
import { find } from "../api/room/reservation-svc/hostel-svc";

// Helpers & Plugins
import { bus } from "../plugins/bus";
import { formatTimezone } from "../helpers/timezone";
import sortRooms from "../helpers/room/sort";
import { getBestLocale } from "../helpers/locale";
import RoomsViewOptions from "../config/rooms-view-options";

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
    viewOptions: {
      type: Object,
      default() {
        return RoomsViewOptions;
      },
    },
    roomViewAnchorPoint: {
      type: String,
      default: "roomView",
    },
    bookingSource: {
      type: String,
      default: "STC",
    },
    // default hostelCode
    hostelCode: {
      type: String,
      default: "BRI",
    },
    checkIn: {
      type: String,
      default: () => {
        return new Date().toISOString().slice(0, 10);
      },
    },
    checkOut: {
      type: String,
      default: () => {
        var date = new Date();
        date.setDate(date.getDate() + 2);
        return date.toISOString().slice(0, 10);
      },
    },
    cid: {
      type: String,
      required: true,
    },
  },
  watch: {
    async hostelCode() {
      console.info("The hostel was changed!", this.hostelCode);
      await this.loadData();
    },
    async checkIn() {
      console.info("The checkIn was changed!", this.checkIn);
      await this.loadData();
    },
    async checkOut() {
      console.info("The checkOut was changed!", this.checkOut);
      await this.loadData();
    },
    async cid() {
      console.info("The cid was changed!", this.cid);
      await this.loadData();
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
      openPanel: [0, 1, 2],
      isLoading: false,
      isError: false,
      isStatus: false,
      status: null,
      availabilityError: false,
      rooms: null,
      cart: null,
      showSummaryBreakfast: false,
      userLanguage: null,
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
    ...mapGetters("bookingEngine", [
      "contentHostelData",
      "contentTheBreadCrumbs",
      "contentTheCovidMeasures",
      "contentTheSummary",
      "contentRoomsOverlayErrors",
      "contentRoomsSearchSummary",
      "contentRoomsModalGroupBookings",
      "contentRoomsOptions",
      "contentRoomsExpansionHeaders",
      "getUserLanguage",
    ]),
  },
  async beforeCreate() {
    if (this.$store.state.bookingEngine.userLanguage === "en-GB") {
      const browserLocaleCode = getBestLocale(getUserLocales());
      if (browserLocaleCode !== "en-GB") {
        this.$store.commit(
          "bookingEngine/SET_USER_LANGUAGE",
          browserLocaleCode,
        );
      }
    }

    await this.$store.dispatch("bookingEngine/getJourneyUi");
    this.uiContentLoaded = this.contentTheBreadCrumbs;
  },
  async created() {
    await this.loadData();
  },
  mounted() {
    if (this.roomViewAnchorPoint === "roomView") {
      setTimeout(() => {
        this.$refs.roomView.scrollIntoView();
      });
    } else {
      const el = document.getElementById(this.roomViewAnchorPoint);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView();
        });
      }
    }
  },
  methods: {
    async createOrLoadCart() {
      console.info("Creating or loading cart");
      if (!this.cart) {
        console.info(
          "The sessions doesn't have an exisiting cart, creating a new cart.",
        );
        this.cart = await createCart(this, this.bookingSource, this.cid);
        // The cart items is not returned when the cart is created.
        this.cart.items = [];
      }

      bus.$on("cart-transaction-updated", (cart) => {
        this.cart = cart;
      });
    },
    reloadAvailability() {
      this.$router.push({
        path: this.$route.path,
      });
    },
    closeErrorOverlay() {
      this.isError = false;
      this.availabilityError = false;
    },
    async loadData() {
      if (this.isLoading) return;

      this.isLoading = true;
      this.reset();

      const status = await getStatus(this);
      if (status.upgrading) {
        this.isStatus = true;
        this.status = status.message;
        this.isLoading = false;
        return;
      }

      this.$store.dispatch("bookingEngine/getHostel", this.hostelCode);

      const [rooms, hostel] = await Promise.all([
        getAvailability(
          this,
          this.hostelCode,
          this.checkIn,
          this.checkOut,
          this.cid,
          this.bookingSource,
        ),
        find(this, this.hostelCode),
      ]);

      if (rooms.message && rooms.message === "unable to get availablity") {
        this.availabilityError = true;
        this.isLoading = false;
        return;
      }

      await this.createOrLoadCart();

      this.rooms = rooms;
      this.hostel = this.contentHostelData;
      this.userLanguage = this.getUserLanguage;
      this.hostelConf = hostel;
      console.log({ cart: this.cart });
      this.depositModelRate = this.cart.deposit_model_rate;

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
      this.cart = getCart(this.cid);

      this.$router.push({
        path: window.location.pathname.replace("availability", "") + "payment",
        query: { cid: this.cid },
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
    async handleLanguageChange(code) {
      this.$store.commit("bookingEngine/SET_USER_LANGUAGE", code);
      await this.$store.dispatch("bookingEngine/getHostel", this.hostelCode);
      this.hostel = this.contentHostelData;
      this.userLanguage = this.getUserLanguage;
      await this.$store.dispatch("bookingEngine/getJourneyUi");
      this.uiContentLoaded = this.contentTheBreadCrumbs;
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

.language-picker-and-room-options {
  margin: auto;
}

@media screen and (min-width: 600px) {
  .v-expansion-panel--active:nth-child(2) {
    margin-top: 0px !important;
  }
}
</style>
