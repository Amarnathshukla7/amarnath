<template>
  <div id="app">
    <room-and-transaction-view></room-and-transaction-view>
  </div>
</template>

<script>
import RoomAndTransactionView from "./views/RoomAndTransactionView.vue";

export default {
  name: "app",
  components: {
    RoomAndTransactionView,
  },
};
</script>

<style>
@import url(https://use.typekit.net/dzk4xxw.css);

#app {
  font-family: "ff-tisa-web-pro", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
