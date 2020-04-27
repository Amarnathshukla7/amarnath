<template>
  <v-app>
    <v-overlay class="text-center" :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <room-view
      v-if="isRooms && hostel && hostelConf"
      @go-to-view="changeView"
      :hostel="hostel"
      :hostel-conf="hostelConf"
      :hostel-code="code"
      :check-in="checkIn"
      :check-out="checkOut"
      :booking-source="bookingSource"
      :roomViewAnchorPoint="roomViewAnchorPoint"
    ></room-view>
    <transaction-view
      v-if="isTransaction && hostel && hostelConf"
      :cart="data"
      :hostel="hostel"
      :hostel-conf="hostelConf"
      :stripe-key="stripeKey"
    ></transaction-view>
  </v-app>
</template>

<script>
import RoomView from "./RoomView.vue";
import TransactionView from "../transaction/TransactionView.vue";
import { getHostel } from "../../plugins/hostel";
import { find } from "./api/reservation-svc/hostel-svc";

export default {
  props: {
    stripeKey: {
      type: String,
      default: "pk_test_97WWfDjUOsVWAzm3y1g8t0BJ00F4iyqoge",
    },
    bookingSource: {
      type: String,
      default: "STC",
    },
    checkIn: {
      type: String,
      default: "2020-11-16",
    },
    checkOut: {
      type: String,
      default: "2020-11-17",
    },
    code: {
      type: String,
      default: "COP",
    },
    roomViewAnchorPoint: {
      type: String,
      default: "roomView",
    },
  },
  components: {
    RoomView,
    TransactionView,
  },
  data() {
    return {
      isLoading: false,
      view: "room",
      data: null,
      hostel: null,
      hostelConf: null,
    };
  },
  watch: {
    async code(code) {
      this.isLoading = true;
      this.hostel = await getHostel(code);
      this.hostelConf = await find(code);
      this.isLoading = false;
      this.view = "room";
    },
  },
  async created() {
    this.isLoading = true;
    this.hostel = await getHostel(this.code);
    this.hostelConf = await find(this.code);
    this.isLoading = false;
  },
  mounted() {
    window.addEventListener("beforeunload", this.preventCloseByAccident);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.preventCloseByAccident);
  },
  methods: {
    preventCloseByAccident(event) {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = "";

      return confirm("Are you sure you want to abandon your search?");
    },
    changeView(view, data) {
      this.data = data;
      this.view = view;
    },
  },
  computed: {
    isRooms() {
      return this.view === "room";
    },
    isTransaction() {
      return this.view === "transaction";
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
</style>
