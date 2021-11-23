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

      <RoomsSearchSummary
        v-if="uiContentLoaded"
        :hostel="hostelCode"
        :nights="nights"
        :arrival="checkIn"
        :departure="checkOut"
        :language="userLanguage"
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
        <v-row
          class="language-picker-and-room-options"
          v-show="!showSummaryBreakfast"
          no-gutters
        >
          <v-col v-if="true" cols="2" sm="1">
            <TheLanguagePicker
              :userLanguage="userLanguage"
              @languageChange="handleLanguageChange"
            />
          </v-col>
          <v-col cols="9" sm="10" xl="8" class="ml-3">
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
      </v-container>
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
import { get as idbGet, set as idbSet } from "idb-keyval";
import { getUserLocales } from "get-user-locale";

// APIs
import { availability as getAvailability } from "../api/room/search-svc";
import {
  create as createCart,
  getItems as getCartItems,
} from "../api/room/reservation-svc/cart-svc";
import { getStatus } from "../api/room/reservation-svc/status-svc";
import { find } from "../api/room/reservation-svc/hostel-svc";

// Helpers & Plugins
import { bus } from "../plugins/bus";
import { formatTimezone } from "../helpers/timezone";
import sortRooms from "../helpers/room/sort";
import { getBestLocale } from "../helpers/locale";

// Components
import RoomsBookingSummary from "../components/RoomsBookingSummary";
import TheBreadCrumbs from "../components/TheBreadCrumbs";
import TheCovidMeasures from "../components/TheCovidMeasures";
import TheLanguagePicker from "../components/TheLanguagePicker";
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
    // default hostelCode
    hostelCode: {
      type: String,
      default: "BRI",
    },
    checkIn: {
      type: String,
      default: "2021-12-13",
    },
    checkOut: {
      type: String,
      default: "2021-12-14",
    },
    cid: {
      type: String,
      required: true,
    },
  },
  watch: {
    async cart() {
      // Updating the indexedb with cart details only when the cart
      // has value.
      if (this.cart) {
        await idbSet(`cart.${this.cid}`, this.cart);
      }
    },
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
    TheLanguagePicker,
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

    this.cart = await idbGet(`cart.${this.cid}`);
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
      this.cart = await idbGet(`cart.${this.cid}`);
      if (!this.cart) {
        console.info(
          "The sessions doesn't have an exisiting cart, creating a new cart.",
        );
        this.cart = await createCart(this.bookingSource, this.cid);
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

      const status = await getStatus();
      if (status.upgrading) {
        this.isStatus = true;
        this.status = status.message;
        this.isLoading = false;
        return;
      }

      console.log(status);

      try {
        this.$store.dispatch("bookingEngine/getHostel", this.hostelCode);

        const [rooms, hostel] = await Promise.all([
          getAvailability(
            this.hostelCode,
            this.checkIn,
            this.checkOut,
            this.cid,
          ),
          find(this.hostelCode),
        ]);

        if (rooms.message && rooms.message === "unable to get availablity") {
          this.availabilityError = true;
          this.isLoading = false;
          return;
        }

        console.log(rooms);

        await this.createOrLoadCart();

        this.rooms = rooms;
        this.hostel = this.contentHostelData;
        this.userLanguage = this.getUserLanguage;
        this.hostelConf = hostel;
        this.depositModelRate = this.cart.deposit_model_rate;
      } catch (e) {
        console.error(e);
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
      await idbSet(`cart.${this.cid}`, this.cart);

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
  max-width: 1161px;
}

@media screen and (min-width: 600px) {
  .v-expansion-panel--active:nth-child(2) {
    margin-top: 0px !important;
  }
}
</style>
