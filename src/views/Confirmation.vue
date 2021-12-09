<template>
  <v-app v-if="reservation && hostel">
    <ConfirmationEasterEggOverlay
      v-if="overlay && viewOptions.canShowEasterEggOverlay"
      @close-overlay="overlay = false"
    />

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" class="my-4">
          <TheBreadCrumbs
            :steps="viewOptions.steps"
            :current-step-key="viewOptions.currentStepKey"
            :content="contentTheBreadCrumbs"
            :can-go-back="false"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-center">
          <ConfirmationThankYou v-if="uiContentLoaded" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6" lg="5" offset-lg="1">
          <ConfirmationSummary
            v-if="uiContentLoaded"
            :reservation="reservation"
          />
        </v-col>

        <v-col cols="12" md="6" lg="5">
          <ConfirmationHostelInfo
            @pack-bags="packYourBags += 1"
            :hostel="hostel"
          />
        </v-col>
      </v-row>

      <v-row v-if="viewOptions.canSignUpNewsletter">
        <v-col cols="12" md="6" lg="5" offset-lg="1">
          <ConfirmationSignUp :reservation-id="reservation.id" />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// Packages
import { mapState, mapGetters } from "vuex";
import { subDays, differenceInCalendarDays } from "date-fns";

// Helpers, Plugins, Filters & Data
import { track } from "../helpers/transaction/tracking";
import { getReservation } from "../api/transaction/reservation-svc";
import ConfirmationViewOptions from "../config/confirmation-view-options";

// Components
import ConfirmationSummary from "../components/ConfirmationSummary";
import TheBreadCrumbs from "../components/TheBreadCrumbs.vue";
import ConfirmationEasterEggOverlay from "../components/ConfirmationEasterEggOverlay";
import ConfirmationHostelInfo from "../components/ConfirmationHostelInfo";
import ConfirmationSignUp from "../components/ConfirmationSignUp";
import ConfirmationThankYou from "../components/ConfirmationThankYou";

export default {
  props: {
    viewOptions: {
      type: Object,
      default() {
        return ConfirmationViewOptions;
      },
    },
    cid: {
      type: String,
      required: true,
    },
  },
  components: {
    ConfirmationSummary,
    TheBreadCrumbs,
    ConfirmationEasterEggOverlay,
    ConfirmationHostelInfo,
    ConfirmationSignUp,
    ConfirmationThankYou,
  },
  data() {
    return {
      packYourBags: 0,
      overlay: false,
      reservation: null,
      hostel: null,
      uiContentLoaded: null,
    };
  },
  computed: {
    ...mapState("bookingEngine", ["journeyUi", "hostelData"]),
    ...mapGetters("bookingEngine", ["contentTheBreadCrumbs"]),
  },
  watch: {
    packYourBags(val) {
      if (val === 5) {
        this.overlay = true;
        setTimeout(() => {
          this.overlay = false;
          this.packYourBags = 0;
        }, 17000);
      }
    },
  },
  async created() {
    /**
     * # Problem
     *
     * Everytime the customer lands on the Rooms view and adds and item to cart a new cart is created, this means the customers
     * browser will get filled with unporcessed carts and reservations key value. Since the customer still may have
     * an active cart, you cannot remove all the carts.
     *
     * The key/value storage is the wrose choice since there is no order to keys. Everytime a new
     * record is added the order changes.
     *
     * ## Notes
     *
     * 1. Customer can have multiple availability happening at the same time
     * 2. When the customer visit the availability page a cart.{token} key and value is created.
     * 3. When the customer makes a successful payment + reservation a idb key value reservation.{token} is created.
     *
     * ## Solution
     *
     * - [x] Before creating a new idb cart.{token} check the value if undefined dont set
     *    this is to make sure all the idb key values that are created can be traced by created_at.
     * - [..] To keep it basic logic introduce a check before deleting, the created_at must be 7 days old to delete.
     *
     * ## Advantages
     *
     * - The cid query parameters allows us to trace customer with in different platforms, this is 100% requirement.
     *    -- e.g. google, hotjar
     * - We can submit all the saved cart and reservations to trace to customers old bookings. Risks if the customer
     * manupulates the data.
     * - Tracking customers interest, to provide discounts within same region.
     *
     * ## Risks
     *
     * - Customer may have a different date and time setup on their local. This can cause issues with deleting
     *   carts that are still active.
     * - The customer may go crazy on refresh page and endup with alot of data in indexeddb. Introducing another problem,
     *   all these issues can be solved by using the persistant state, the state can be implemented by key as timestamp to
     *   sort values and check against max carts.
     */

    this.reservation = await getReservation(this, this.cid);
    console.info("Getting reservation details", this.reservation);

    await this.$store.dispatch("bookingEngine/getJourneyUi");
    this.uiContentLoaded = this.journeyUi;

    await this.$store.dispatch(
      "bookingEngine/getHostelConfirmationPageData",
      this.reservation.cart.hostel.hostel_code,
    );
    this.hostel = this.hostelData;
    console.info("Getting hostel details", this.hostel);
  },
  async mounted() {
    /**
     * Tracking with google analytics.
     */
    if (!this.$route.query.dev) {
      const resInterval = setInterval(() => {
        if (this.reservation) {
          clearInterval(resInterval);
          track(this, this.reservation);
        }
      }, 500);
    }
  },
};
</script>

<style lang="scss">
.map iframe {
  width: 100%;
  max-height: 325px;
  margin: auto;
}

.v-application *,
.v-application .subtitle-1,
.v-application .headline,
.v-application .display-1,
.v-application .body-1,
.v-application .body-2 {
  font-family: $body-font-family, sans-serif !important;
}

.v-application {
  font-family: $body-font-family, sans-serif !important;

  .title {
    // To pin point specific classes of some components
    font-family: $title-font, sans-serif !important;
  }
}
</style>
