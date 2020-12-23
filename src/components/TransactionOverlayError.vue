<template>
  <v-overlay :value="error" opacity=".8" class="text-center">
    <div class="title">Error</div>
    <div class="body-1 px-4">
      <span v-if="$parent.$parent.isPmsError">
        {{ contentTransactionOverlays.error.pmsError }}:
        <br />
        <br />
        {{ reservation.booking_reference }}
      </span>
      <span v-else>{{ contentTransactionOverlays.error.otherError }}</span>
    </div>
    <v-btn class="mt-4" icon @click="$parent.$parent.isError = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-overlay>
</template>

<script>
import { mapGetters } from "vuex";

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
    ...mapGetters("bookingEngine", ["contentTransactionOverlays"]),
  },
};
</script>
