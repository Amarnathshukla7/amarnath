<template>
  <v-overlay :value="error" opacity=".8" class="text-center">
    <div class="title">Error</div>
    <div class="body-1 px-4">
      <span v-if="$parent.isPmsError">
        Issue occurred creating booking, please refresh this page and try again.
        Reference:
        <br />
        <br />
        {{ reservation.booking_reference }}
      </span>
      <span v-else>Something unexpected went wrong, please try again</span>
    </div>
    <v-btn class="mt-4" icon @click="$parent.isError = false">
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
