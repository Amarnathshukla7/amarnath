<template>
  <v-overlay :value="error" opacity=".8" class="text-center">
    <div class="title">Error</div>
    <div class="body-1 px-4">
      <span v-if="$parent.isPmsError">
        {{ journeyUi.bookingOverlay.error.pmsError }}:
        <br />
        <br />
        {{ reservation.booking_reference }}
      </span>
      <span v-else>{{ journeyUi.bookingOverlay.error.otherError }}</span>
    </div>
    <v-btn class="mt-4" icon @click="$parent.isError = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-overlay>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    error: {
      type: Boolean,
      default: false,
    },
    reservation: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapState(["journeyUi"]),
  },
};
</script>
