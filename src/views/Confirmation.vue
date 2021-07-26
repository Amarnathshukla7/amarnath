<template>
  <v-app v-if="reservation && hostel">
    <ConfirmationEasterEggOverlay
      v-if="overlay"
      @close-overlay="overlay = false"
    />

    <v-container>
      <v-row no-gutters>
        <v-col cols="12" class="my-4">
          <TheBreadCrumbs
            v-if="uiContentLoaded"
            :step="4"
            :content="contentTheBreadCrumbs"
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

      <v-row>
        <v-col cols="12" md="6" lg="5" offset-lg="1">
          <ConfirmationSignUp :reservation-id="reservation.id" />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// Packages
import { get } from "idb-keyval";
import { mapState, mapGetters } from "vuex";

// Helpers, Plugins, Filters & Data
import { stcSpaceClient } from "../plugins/contentful";
import { track } from "../helpers/transaction/tracking";

// Components
import ConfirmationSummary from "../components/ConfirmationSummary";
import TheBreadCrumbs from "../components/TheBreadCrumbs.vue";
import ConfirmationEasterEggOverlay from "../components/ConfirmationEasterEggOverlay";
import ConfirmationHostelInfo from "../components/ConfirmationHostelInfo";
import ConfirmationSignUp from "../components/ConfirmationSignUp";
import ConfirmationThankYou from "../components/ConfirmationThankYou";

export default {
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
    if (!this.$route.query.dev) {
      this.reservation = await get("reservation");
    } else {
      this.reservation = {
        cart: {
          hostel: {
            hostel_code: "HMM",
            currency: "GBP",
          },
          accommodation_cost: 10_000,
          discount: 1_000,
          tourist_tax_cost: 500,
          extras_cost: 0,
          total_cost: 9_500,
        },
        transaction: {
          currency: "GBP",
        },
        booking_reference: "STC-HMM-12345678",
        paid: 9_500,
        deposit: 100,
      };
    }

    await this.$store.dispatch("bookingEngine/getJourneyUi");
    this.uiContentLoaded = this.journeyUi;

    await this.$store.dispatch(
      "bookingEngine/getHostelConfirmationPageData",
      this.reservation.cart.hostel.hostel_code,
    );

    this.hostel = this.hostelData;
  },
  async mounted() {
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
