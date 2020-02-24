<template>
  <v-app>
    <room-view
      v-if="isRooms && hostel && hostelConf"
      @go-to-view="changeView"
      :hostel="hostel"
      :hostel-conf="hostelConf"
      :hostel-code="code"
      :check-in="checkIn"
      :check-out="checkOut"
    ></room-view>
    <transaction-view
      v-if="isTransaction && hostel && hostelConf"
      :cart="data"
      :hostel="hostel"
      :hostel-conf="hostelConf"
    ></transaction-view>
  </v-app>
</template>

<script>
import RoomView from "../components/room/RoomView.vue";
import TransactionView from "../components/transaction/TransactionView.vue";
import { getHostel } from "../plugins/hostel";
import { find } from "../components/room/api/reservation-svc/hostel-svc";

export default {
  props: {
    checkIn: {
      type: String,
      default: "2020-03-12",
    },
    checkOut: {
      type: String,
      default: "2020-03-18",
    },
    code: {
      type: String,
      default: "BRI",
    },
  },
  components: {
    RoomView,
    TransactionView,
  },
  data() {
    return {
      view: "room",
      data: null,
      hostel: null,
      hostelConf: null,
    };
  },
  watch: {
    async code(code) {
      this.hostel = await getHostel(code);
      this.hostelConf = await find(code);
    },
  },
  async created() {
    this.hostel = await getHostel(this.code);
    this.hostelConf = await find(this.code);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload");
  },
  mounted() {
    window.addEventListener("beforeunload", event => {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = "";

      return confirm("Are you sure you want to abandon your search?");
    });
  },
  methods: {
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
$body-font-family: "ff-tisa-web-pro";
$title-font: "proxima-nova";

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

#app {
  font-family: "proxima-nova", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
