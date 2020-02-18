<template>
  <div id="app">
    <room-and-transaction-view></room-and-transaction-view>
    <confirmation v-if="asd" />
  </div>
</template>

<script>
import RoomAndTransactionView from "./views/RoomAndTransactionView.vue";
import Confirmation from "./components/confirmation/ConfirmationView.vue";

export default {
  name: "app",
  components: {
    RoomAndTransactionView,
    Confirmation,
  },
};
</script>

<style lang="scss">
@import url(https://use.typekit.net/dzk4xxw.css);

$body-font-family: "proxima-nova";
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
