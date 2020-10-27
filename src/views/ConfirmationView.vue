<template>
  <v-app v-if="reservation && hostel">
    <EasterEggOverlay v-if="overlay" @close-overlay="overlay = false" />

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
          <ThankYou v-if="uiContentLoaded" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6" lg="5" offset-lg="1">
          <BookingSummary v-if="uiContentLoaded" :reservation="reservation" />
        </v-col>

        <v-col cols="12" md="6" lg="5">
          <HostelInfo @pack-bags="packYourBags += 1" :hostel="hostel" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6" lg="5" offset-lg="1">
          <SignUp />
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
import BookingSummary from "../components/confirmation/Summary";
import TheBreadCrumbs from "../components/TheBreadCrumbs.vue";
import EasterEggOverlay from "../components/confirmation/EasterEggOverlay";
import HostelInfo from "../components/confirmation/HostelInfo";
import SignUp from "../components/confirmation/SignUp";
import ThankYou from "../components/confirmation/ThankYou";

export default {
  components: {
    BookingSummary,
    TheBreadCrumbs,
    EasterEggOverlay,
    HostelInfo,
    SignUp,
    ThankYou,
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
    ...mapState(["journeyUi", "hostelData"]),
    ...mapGetters(["contentTheBreadCrumbs"]),
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

    await this.$store.dispatch("getJourneyUi");
    this.uiContentLoaded = this.journeyUi;

    await this.$store.dispatch(
      "getHostelConfirmationPageData",
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
