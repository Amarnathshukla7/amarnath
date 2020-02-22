<template>
  <v-dialog v-model="dialog" fullscreen>
    <!-- <v-card> -->
    <booking-summary
      :cart-data="cartData"
      :rooms-content="roomsContent"
    ></booking-summary>
    <!-- </v-card> -->
  </v-dialog>
</template>

<script>
export default {
  props: {
    cartData: {
      type: Object,
      default: null,
    },
    roomsContent: {
      type: Object,
      default: null,
    },
  },
  components: {
    // BookingSummary: () => import("./components/summary/BookingSummary.vue"),
  },
  data() {
    return {
      dialog: true,
      open: 0,
    };
  },
};
</script>

<style lang="scss" scoped></style>
