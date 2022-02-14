<template>
  <v-overlay class="text-center" :value="loadingOverlay" :opacity="0.8">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
    <div
      v-if="loadingReservation"
      style="max-width: 620px"
      class="heading mt-10 px-6"
    >
      Loading...
    </div>
  </v-overlay>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    loadingOverlay: {
      type: Boolean,
      default: false,
    },
    loadingReservation: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters("bookingEngine", ["contentTransactionOverlays"]),
  },
};
</script>
