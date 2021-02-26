<template>
  <v-list-item class="desktop-summary-item pa-0">
    <v-list-item-content class="text-left">
      <v-list-item-subtitle class="ml-2 body-1 font-weight-bold accent--text">
        {{ room.checkIn | formatDate(language) }}
        <span v-if="room.checkOut"
          >- {{ room.checkOut | formatDate(language) }}</span
        >
      </v-list-item-subtitle>

      <v-list-item-title
        class="room-name ml-2 font-weight-bold greyish--text my-3"
      >
        {{ room.name }}
      </v-list-item-title>

      <v-list-item-subtitle>
        <v-row no-gutters>
          <v-col class="pl-md-2" cols="6">
            <span class="accent white--text pl-lg-1 mr-2">
              <v-icon color="white" small>mdi-account</v-icon>
              x{{ room.maxOccupancy * room.qty }}
            </span>
            {{ contentTheSummary.miscContent.in }} {{ room.qty }}
            {{ bedType }}
          </v-col>
          <v-col cols="6" class="text-right">
            <div class="mr-2 body-1 mt-n1 font-weight-bold">
              {{ room.cost | formatPrice(currency) }}
            </div>
          </v-col>
        </v-row>
      </v-list-item-subtitle>
      <v-divider class="mt-4 mb-n2"></v-divider>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapGetters } from "vuex";
import { formatPrice } from "../filters/money";
import { formatDate } from "../filters/date";

export default {
  props: {
    index: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "GBP",
    },
    language: {
      type: String,
      default: "en-GB",
    },
    room: {
      type: Object,
      default: null,
    },
  },
  filters: {
    formatPrice,
    formatDate,
  },
  computed: {
    personDescriptor() {
      return this.room.maxOccupancy === 1 ? "Person" : "People";
    },
    bedType() {
      if (this.room.qty === 1)
        return this.room.type === "private"
          ? this.contentTheSummary.miscContent.room
          : this.contentTheSummary.miscContent.bed;
      else
        return this.room.type === "private"
          ? this.contentTheSummary.miscContent.rooms
          : this.contentTheSummary.miscContent.beds;
    },
    ...mapGetters("bookingEngine", ["contentTheSummary"]),
  },
};
</script>

<style lang="scss" scoped>
.room-name {
  white-space: normal;
}
</style>
