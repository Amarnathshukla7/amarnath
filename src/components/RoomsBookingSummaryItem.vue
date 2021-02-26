<template>
  <v-list-item class="desktop-summary-item pa-0">
    <v-list-item-content class="text-left">
      <v-list-item-subtitle class="ml-10 body-1 font-weight-bold accent--text">
        {{ room.checkIn | formatDate(language) }}
        <span v-if="room.checkOut"
          >- {{ room.checkOut | formatDate(language) }}</span
        >
      </v-list-item-subtitle>

      <v-list-item-title
        class="delete-room-name-container font-weight-bold greyish--text d-flex align-center"
      >
        <v-btn icon @click="destroy">
          <v-icon small>mdi-trash-can</v-icon>
        </v-btn>
        <span class="white-space-normal">{{ room.name }}</span>
      </v-list-item-title>

      <v-list-item-subtitle v-if="isSelected">
        <v-row no-gutters>
          <v-col class="pl-md-2" cols="6">
            <span class="accent white--text pl-lg-1 mr-2">
              <v-icon color="white" small>mdi-account</v-icon>
              x{{ room.maxOccupancy * room.qty }}
            </span>
            {{ contentTheSummary.miscContent.in }}
            {{ room.qty }}
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
import { formatPrice } from "../filters/money";
import { formatDate } from "../filters/date";
import { mapGetters } from "vuex";

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
    isSelected: {
      type: Boolean,
      default: true,
    },
  },
  filters: {
    formatPrice,
    formatDate,
  },
  methods: {
    destroy() {
      const date = this.room.checkOut ? "" : this.room.checkIn;
      this.$emit("destroy-room", this.room.code, date);
    },
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
.delete-room-name-container {
  white-space: normal;
  gap: 3px;
}
</style>
