<template>
  <v-card flat class="ma-3">
    <v-card-title class="warning--text pb-0">
      <v-icon color="warning">mdi-exclamation-thick</v-icon>
      {{ contentRoomsListingCard.custom.error.heading }}:
    </v-card-title>

    <v-card-text class="pr-6 pl-10 text-left warning--text">
      {{ contentRoomsListingCard.custom.error.message }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("bookingEngine", ["contentRoomsListingCard"]),
  },
};
</script>

<style lang="scss" scoped></style>
