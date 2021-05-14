<template>
  <v-overlay
    class="text-center"
    :value="error || availabilityError"
    :opacity="0.9"
    color="white"
  >
    <div
      v-if="availabilityError"
      :key="content.searchError.heading"
      class="headline black--text font-weight-bold mb-4"
    >
      {{ content.searchError.heading }}
    </div>

    <div
      v-else-if="error"
      :key="content.networkError.heading"
      class="headline black--text font-weight-bold mb-4"
    >
      {{ content.networkError.heading }}
    </div>

    <div
      style="max-width: 600px; line-height: 2"
      class="body-1 px-2 font-weight-bold black--text"
    >
      <span v-if="availabilityError" :key="content.searchError.message">
        {{ content.searchError.message }}

        <span v-if="hostelCode === 'NOS'">
          <br />
          <br />
          NosDa hostel is currently only open for reservations over the weekend
          from the 25th of June 2021 onwards
        </span>
      </span>

      <span v-else-if="error" :key="content.networkError.message">
        {{ content.networkError.message }}
      </span>
    </div>

    <v-btn class="mt-4 mr-4 font-weight-bold" @click="reloadData">
      <v-icon>mdi-refresh</v-icon>
      {{ content.errorButtons.tryAgain }}
    </v-btn>

    <v-btn class="mt-4 font-weight-bold" @click="closeOverlay">
      <v-icon>mdi-close</v-icon>
      {{ content.errorButtons.close }}
    </v-btn>
  </v-overlay>
</template>

<script>
export default {
  emits: ["close-overlay", "reload-data"],
  props: {
    error: {
      type: Boolean,
      default: false,
    },
    availabilityError: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      default: () => {
        return {};
      },
    },
    hostelCode: {
      type: String,
      default: null,
    },
  },
  methods: {
    closeOverlay() {
      this.$emit("close-overlay");
    },
    reloadData() {
      this.$emit("reload-data");
    },
  },
};
</script>
