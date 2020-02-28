<template>
  <v-app v-if="reservation && hostel">
    <v-overlay class="text-center" :value="overlay">
      <iframe
        width="1080"
        height="620"
        src="https://www.youtube-nocookie.com/embed/tBYlNZRi_Jw?controls=0&autoplay=1"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope"
        allowfullscreen
      ></iframe>
      <br />
      <v-btn x-large icon @click="overlay = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-overlay>
    <v-container>
      <v-row no-gutters>
        <v-col cols="12 mb-6">
          <bread-crumbs :step="4" />
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
        <v-col cols="12" md="6">
          <v-card tile class="other">
            <div
              class="white--text text-center accent px-4 py-8 font-weight-bold title mx-auto"
            >
              Your booking reference number is:
              <div class="display-1 font-weight-bold">
                {{ reservation.booking_reference }}
              </div>
            </div>
            <v-list-item class="py-2 pl-8 white">
              <v-list-item-content>
                <v-list-item-title>
                  Accommodation Sub-Total
                  <span class="float-right mr-6">{{
                    reservation.cart.accommodation_cost
                      | formatPrice(reservation.cart.hostel.currency)
                  }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="py-2 pl-8 other">
              <v-list-item-content>
                <v-list-item-title>
                  Loyalty Coupon Code
                  <span class="float-right mr-6">{{
                    reservation.cart.discount
                      | formatPrice(reservation.cart.hostel.currency)
                  }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="py-2 pl-8 white">
              <v-list-item-content>
                <v-list-item-title>
                  Tourist Tax Total
                  <span class="float-right mr-6">{{
                    reservation.cart.tourist_tax_cost
                      | formatPrice(reservation.cart.hostel.currency)
                  }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="py-2 pl-8 other">
              <v-list-item-content>
                <v-list-item-title>
                  Breakfast Total
                  <span
                    class="float-right mr-6"
                    v-if="reservation.cart.extras_cost > 0"
                  >
                    {{
                      reservation.cart.extras_cost
                        | formatPrice(reservation.cart.hostel.currency)
                    }}
                  </span>
                  <span class="float-right mr-6" v-else>
                    Included for FREE!
                  </span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="py-2 pl-8 accent">
              <v-list-item-content>
                <v-list-item-title class="white--text font-weight-bold">
                  Total Price
                  <span class="float-right mr-6">{{
                    reservation.cart.total_cost
                      | formatPrice(reservation.cart.hostel.currency)
                  }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="py-2 pl-8 white">
              <v-list-item-content>
                <v-list-item-title>
                  Total Paid
                  <span class="float-right mr-6">{{
                    reservation.paid
                      | formatPrice(reservation.cart.hostel.currency)
                  }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="py-2 pl-8 accent font-weight-bold">
              <v-list-item-content>
                <v-list-item-title class="white--text">
                  Due on arrival
                  <span class="float-right mr-6">{{
                    dueOnArrival | formatPrice(reservation.cart.hostel.currency)
                  }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
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
              width="80%"
              color="secondary"
              class="subtitle-1 font-weight-bold my-4"
              >Manage my booking</v-btn
            >
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="accent " tile>
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
                color="secondary"
                class="font-weight-bold mt-4"
              >
                Signup!
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import contentful from "../../plugins/contentful";
import BreadCrumbs from "../shared/BreadCrumbs.vue";
import { formatPrice } from "../../filters/money";
import { get } from "idb-keyval";

export default {
  components: {
    BreadCrumbs,
  },
  data() {
    return {
      packYourBags: 0,
      overlay: false,
      bookingRef: "TEST-STC-BRI-25353491",
      reservation: null,
      hostel: null,
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
  async created() {
    // this.reservation = await get(this.bookingRef);

    this.reservation = await get("reservation");

    console.log(this.reservation);

    const hostelReq = await contentful.getEntries({
      include: 2,
      content_type: "hostel",
      "fields.code": this.reservation.cart.hostel.hostel_code,
      select:
        "fields.whatToKnow,fields.hostelPageRef,fields.streetAddress,fields.confirmationEmail,fields.title",
    });

    this.hostel = hostelReq.items[0].fields;
  },
  filters: {
    formatPrice,
  },
  computed: {
    dueOnArrival() {
      return this.reservation.cart.total_cost - this.reservation.paid;
    },
  },
};
</script>

<style lang="scss">
.map iframe {
  width: 100%;
  max-height: 325px;
  margin: auto;
}

$body-font-family: "ff-tisa-web-pro";
$title-font: "proxima-nova";

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

#app {
  font-family: "proxima-nova", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
