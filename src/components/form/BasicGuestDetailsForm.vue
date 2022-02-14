<template>
  <v-row>
    <!-- NAME -->
    <v-col cols="12" md="6">
      <v-text-field
        :label="contentTransactionGuestDetails.name.label"
        :rules="rules.name"
        v-model="data.guest.name"
        outlined
      ></v-text-field>
    </v-col>

    <!-- EMAIL -->
    <v-col cols="12" md="6">
      <v-text-field
        :label="contentTransactionGuestDetails.email.label"
        class="mt-n6 mt-md-0"
        :rules="rules.email"
        v-model="data.guest.email"
        outlined
      ></v-text-field>
    </v-col>

    <!-- PHONE -->
    <v-col cols="12" md="6">
      <v-text-field
        class="mt-n6 mb-md-n6"
        :label="contentTransactionGuestDetails.phone.label"
        :rules="rules.phone"
        v-model="data.guest.phone"
        outlined
      ></v-text-field>
    </v-col>

    <!-- COUNTRY -->
    <v-col cols="12" md="6">
      <v-autocomplete
        class="mt-n6 mb-n6"
        :items="countries"
        :label="contentTransactionGuestDetails.country.label"
        :rules="rules.country"
        v-model="data.guest.country"
        outlined
      ></v-autocomplete>
    </v-col>
  </v-row>
</template>
<script>
import countries from "../../data/countries";
export default {
  data() {
    return {
      countries,
    };
  },
  props: {
    contentTransactionGuestDetails: {
      type: Object,
      default() {
        return {};
      },
    },
    rules: {
      type: Object,
      default() {
        return {};
      },
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>
