<template>
  <v-card flat outlined class="rounded-0">
    <v-card-title class="mb-4">
      {{ journeyUi.mobileSearchSummary.reservation }}:
    </v-card-title>

    <v-card-subtitle class="reservation-info">
      <p class="font-weight-bold">
        {{ hostelShortName(hostelCode) }}
      </p>

      <p>
        {{ journeyUi.mobileSearchSummary.arriving }}:
        <span class="font-weight-bold">{{ arrivalDate | formatDate }}</span>
      </p>

      <p>
        {{ journeyUi.mobileSearchSummary.departing }}:
        <span class="font-weight-bold">{{ departureDate | formatDate }}</span>
      </p>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import { formatDate } from "../../../filters/date";
import { hostelShortName } from "../../../helpers/hostelNames";

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
  methods: {
    hostelShortName,
  },
  filters: {
    formatDate,
  },
  computed: {
    ...mapState(["journeyUi"]),
  },
};
</script>
