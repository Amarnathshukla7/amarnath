<template>
  <v-overlay
    class="text-center"
    :value="error || availabilityError"
    :opacity="0.9"
    color="white"
  >
    <div
      v-if="availabilityError"
      class="headline black--text font-weight-bold mb-4"
    >
      {{ journeyUi.errors.searchError.heading }}
    </div>

    <div v-else-if="error" class="headline black--text font-weight-bold mb-4">
      {{ journeyUi.errors.networkError.heading }}
    </div>

    <div
      style="max-width: 600px; line-height: 2"
      class="body-1 px-2 font-weight-bold black--text"
    >
      <span v-if="availabilityError">
        {{ journeyUi.errors.searchError.message }}
      </span>

      <span v-else-if="error">
        {{ journeyUi.errors.networkError.message }}
      </span>
    </div>

    <v-btn class="mt-4 mr-4 font-weight-bold" @click="$parent.loadData">
      <v-icon>mdi-refresh</v-icon>
      {{ journeyUi.errors.ctas.tryAgain }}
    </v-btn>

    <v-btn
      class="mt-4 font-weight-bold"
      @click="
        error = false;
        availabilityError = false;
      "
    >
      <v-icon>mdi-close</v-icon>
      {{ journeyUi.errors.ctas.close }}
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
    availabilityError: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["journeyUi"]),
  },
};
</script>
