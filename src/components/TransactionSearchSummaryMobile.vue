<template>
  <v-card flat outlined class="rounded-0">
    <v-card-title class="mb-4">
      {{ contentTransactionSearch.reservation }}:
    </v-card-title>

    <v-card-subtitle class="reservation-info">
      <p class="font-weight-bold">
        {{ hostelShortName(hostelCode) }}
      </p>

      <p>
        {{ contentTransactionSearch.arriving }}:
        <span class="font-weight-bold">{{
          arrivalDate | formatDate(language)
        }}</span>
      </p>

      <p>
        {{ contentTransactionSearch.departing }}:
        <span class="font-weight-bold">{{
          departureDate | formatDate(language)
        }}</span>
      </p>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate } from "../filters/date";
import { hostelShortName } from "../helpers/hostelNames";

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
    language: {
      type: String,
      default: "en-GB",
    },
  },
  methods: {
    hostelShortName,
  },
  filters: {
    formatDate,
  },
  computed: {
    ...mapGetters("bookingEngine", ["contentTransactionSearch"]),
  },
};
</script>
