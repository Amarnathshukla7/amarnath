<template>
  <v-app v-if="reservation && hostel">
    <EasterEggOverlay v-if="overlay" @close-overlay="overlay = false" />
    <v-container>
      <v-row no-gutters>
        <v-col cols="12" class="my-4">
          <bread-crumbs v-if="uiContentLoaded" :step="4" />
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-center">
          <h1 class="display-1 font-weight-bold accent--text">
            THANKS FOR BOOKING
          </h1>
          <p class="body-2">
            You will shortly receive a confirmation email with your booking
            details.
          </p>
        </v-col>
      </v-row>

      <v-row class="">
        <v-col cols="12" md="6" lg="5" offset-lg="1">
          <BookingSummary :reservation="reservation" />
        </v-col>

        <v-col cols="12" md="6" lg="5">
          <v-card tile class="text-center" color="greyback">
            <div
              @click="packYourBags = packYourBags + 1"
              class="display-1 font-weight-bold greyish--text text-center pt-6"
            >
              PACK YOUR BAGS
            </div>
            <div class="body-2">We look forward to welcoming you at:</div>
            <div class="title font-weight-bold greyish--text">
              {{ hostel.title }}
            </div>
            <div class="body-2 mx-auto mt-4" style="max-width: 70%">
              » {{ hostel.hostelPageRef.fields.tabs[0].fields.phoneNumber }} »
              {{ hostel.confirmationEmail }} » {{ hostel.streetAddress }}
            </div>
            <div
              class="map mt-4"
              v-html="hostel.hostelPageRef.fields.tabs[0].fields.tabsMap"
            ></div>
            <v-btn
              href="https://book.st-christophers.co.uk/manage/index.php?s=entry"
              target="_blank"
              width="80%"
              color="secondary"
              class="subtitle-1 font-weight-bold my-4"
              large
              tile
              depressed
              >Manage my booking</v-btn
            >
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6" lg="5" offset-lg="1">
          <v-card class="accent" tile>
            <v-img
              height="350px"
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            />
            <v-card-text class="text-center">
              <div
                class="headline mb-1 white--text font-weight-bold text-center"
              >
                YOUR NEXT BOOKING
              </div>
              <div class="body-1 white--text text-center font-weight-bold">
                Sign up to our newsletter to reveal a 10% discount code below
              </div>
              <v-btn
                large
                tile
                depressed
                :disabled="signUpSuccessful"
                color="secondary"
                class="font-weight-bold mt-4"
                @click="signupToNewsletter"
              >
                <span v-if="!signUpSuccessful">Sign Up!</span>
                <span v-else>Successfully Signed Up!</span>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import { get } from "idb-keyval";
import { stcSpaceClient } from "../plugins/contentful";
import BreadCrumbs from "../components/shared/BreadCrumbs.vue";
import { track } from "../helpers/transaction/tracking";
import { mapState } from "vuex";
import EasterEggOverlay from "../components/confirmation/EasterEggOverlay";
import BookingSummary from "../components/confirmation/Summary";

export default {
  components: {
    BreadCrumbs,
    EasterEggOverlay,
    BookingSummary,
  },
  data() {
    return {
      packYourBags: 0,
      overlay: false,
      bookingRef: "TEST-STC-BRI-25353491",
      reservation: null,
      hostel: null,
      signUpSuccessful: false,
      uiContentLoaded: null,
    };
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
  async beforeCreate() {
    await this.$store.dispatch("getJourneyUi");
    this.uiContentLoaded = this.journeyUi;
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

    await this.$store.dispatch(
      "getHostelConfirmationPageData",
      this.reservation.cart.hostel.hostel_code,
    );

    this.hostel = this.hostelData;

    // const contentful = stcSpaceClient();

    // const hostelReq = await contentful.getEntries({
    //   include: 2,
    //   content_type: "hostel",
    //   "fields.code": this.reservation.cart.hostel.hostel_code,
    //   select:
    //     "fields.whatToKnow,fields.hostelPageRef,fields.streetAddress,fields.confirmationEmail,fields.title",
    // });

    // this.hostel = hostelReq.items[0].fields;
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
  methods: {
    signupToNewsletter() {
      axios.post(`/reservation-svc/${this.reservation.id}/user/marketing`);
      this.signUpSuccessful = true;
    },
  },
  computed: {
    ...mapState(["journeyUi", "hostelData"]),
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
