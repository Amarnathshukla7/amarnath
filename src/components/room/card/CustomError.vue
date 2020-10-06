<template>
  <v-card flat class="ma-3">
    <v-card-title class="warning--text pb-0">
      <v-icon color="warning">mdi-exclamation-thick</v-icon>
      {{ journeyUi.roomCard.custom.error.heading }}:
    </v-card-title>

    <v-card-text class="pr-6 pl-10 text-left warning--text">
      {{ journeyUi.roomCard.custom.error.message }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["journeyUi"]),
  },
};
</script>

<style lang="scss" scoped></style>
