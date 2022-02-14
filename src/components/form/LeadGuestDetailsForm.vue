<template>
  <div>
    <v-row>
      <!-- NAME -->
      <v-col cols="12" md="6">
        <v-text-field
          :label="'First name'"
          :rules="rules.first_name"
          v-model="data.guest.first_name"
          outlined
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          label="Last name"
          :rules="rules.last_name"
          v-model="data.guest.last_name"
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
          class="mt-n6 mt-md-0"
          :label="contentTransactionGuestDetails.phone.label"
          :rules="rules.phone"
          v-model="data.guest.phone"
          outlined
        ></v-text-field>
      </v-col>

      <!-- COUNTRY -->
      <v-col cols="12" md="12">
        <v-autocomplete
          :items="countries"
          :label="contentTransactionGuestDetails.country.label"
          :rules="rules.country"
          v-model="data.guest.country"
          outlined
        ></v-autocomplete>
      </v-col>
    </v-row>
    <div class="bg-gray-200 text-white">
      <details>
        <summary>Why do we need these details?</summary>
        The lead guest details will be stored in our property management system
        and used to identify the lead guest on arrival. We take contact details
        so that in the unlikely case of an emergency, we have a way to reach out
        to the guest. These will not be used for direct marketing.
      </details>
    </div>
  </div>
</template>
<script>
import countries from "../../data/countries";

export default {
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
  data() {
    return {
      countries,
    };
  },
};
</script>
<style scoped>
details {
  border: 1px solid #aaa;
  border-radius: 4px;
  padding: 0.5em 0.5em 0;
  font-size: 0.9em;
}

summary {
  font-weight: bold;
  font-size: 0.9em;
  margin: -0.5em -0.5em 0;
  padding: 0.5em;
}

details[open] {
  padding: 0.5em;
}

details[open] summary {
  border-bottom: 1px solid #aaa;
  margin-bottom: 0.5em;
}
</style>
