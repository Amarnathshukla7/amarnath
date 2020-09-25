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
      Search Error
    </div>
    <div v-else-if="error" class="headline black--text font-weight-bold mb-4">
      Network Error
    </div>

    <div
      style="max-width: 600px; line-height: 2"
      class="body-1 px-2 font-weight-bold black--text"
    >
      <span v-if="availabilityError">
        Uh oh! There's currently no availability for your selected dates. Please
        search for different dates or one of our other hostels.
      </span>
      <span v-else-if="error">
        Please check your connection and click below to try again. If you see
        this error persistently, it might be because there's no rooms/beds
        available on your selected dates. Please click "Close", select new dates
        and click search again
      </span>
    </div>
    <v-btn class="mt-4 mr-4 font-weight-bold" @click="loadData">
      <v-icon>mdi-refresh</v-icon>
      Try Again
    </v-btn>
    <v-btn
      class="mt-4 font-weight-bold"
      @click="
        error = false;
        availabilityError = false;
      "
    >
      <v-icon>mdi-close</v-icon>
      Close
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
    availabilityError: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
