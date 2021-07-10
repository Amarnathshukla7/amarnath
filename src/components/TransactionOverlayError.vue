<template>
  <v-overlay :value="error" opacity=".8" class="text-center">
    <div class="title">Error</div>
    <div class="body-1 px-4">
      <span v-if="$parent.$parent.isPmsError">
        {{ $t("journeyUi.bookingOverlay.error.pmsError") }}:
        <br />
        <br />
        {{ reservation.booking_reference }}
      </span>
      <span v-else>{{ $t("journeyUi.bookingOverlay.error.otherError") }}</span>
    </div>
    <v-btn class="mt-4" icon @click="$parent.$parent.isError = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-overlay>
</template>

<script>
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
};
</script>
