<template>
  <v-card flat outlined class="rounded-0">
    <v-card-title class="mb-4">
      {{ $t("journeyUi.mobileSearchSummary.reservation") }}:
    </v-card-title>

    <v-card-subtitle class="reservation-info">
      <p class="font-weight-bold">
        {{ shortHostelName }}
      </p>

      <p>
        {{ $t("journeyUi.mobileSearchSummary.arriving") }}:
        <span class="font-weight-bold">{{ formattedArrivalDate }}</span>
      </p>

      <p>
        {{ $t("journeyUi.mobileSearchSummary.departing") }}:
        <span class="font-weight-bold">{{ formattedDepartureDate }}</span>
      </p>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import { formatDate } from "../filters/date";
import { hostelShortName } from "../helpers/hostelNames";
import Trans from "@/plugins/translation";

export default {
  props: {
    hostelCode: {
      type: String,
      default: null,
    },
    arrivalDate: {
      type: String,
      default: null,
    },
    departureDate: {
      type: String,
      default: null,
    },
  },
  computed: {
    shortHostelName() {
      return hostelShortName(this.hostelCode);
    },
    formattedArrivalDate() {
      return formatDate(this.arrivalDate, this.$i18n.locale);
    },
    formattedDepartureDate() {
      return formatDate(this.departureDate, this.$i18n.locale);
    },
  },
};
</script>
