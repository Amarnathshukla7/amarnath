<template>
  <v-expansion-panel class="mb-2">
    <v-expansion-panel-header color="primary">
      <v-img
        max-width="20"
        src="/covid-measures/icon-shield-white.svg"
        class="mr-3"
      ></v-img>

      <div class="font-weight-bold white--text text-uppercase heading">
        {{ journeyUi.expansionPanelHeaders.covid }}
      </div>

      <template v-slot:actions>
        <v-icon color="white">$expand</v-icon>
      </template>
    </v-expansion-panel-header>

    <v-expansion-panel-content class="covid-panel pa-4">
      <p>
        In response to COVID-19, these additional safety and sanitation measures
        have been added to this property.
      </p>

      <ul>
        <li>
          <img src="/covid-measures/reduced-dorms-icon.svg" alt="" />

          <p>Reduced Capacity Dorms</p>
        </li>

        <li>
          <img src="/covid-measures/private-rooms-icon.svg" alt="" />

          <p>Private Dorms for Groups</p>
        </li>

        <li>
          <img src="/covid-measures/social-distancing-icon.svg" alt="" />

          <p>Social Distancing</p>
        </li>

        <li>
          <img src="/covid-measures/hand-hygiene-icon.svg" alt="" />

          <p>Hand Hygienization</p>
        </li>

        <li>
          <img src="/covid-measures/deep-cleaning-icon.svg" alt="" />

          <p>Deep Cleaning & Sanitation</p>
        </li>

        <li>
          <img src="/covid-measures/free-cancellation-icon.svg" alt="" />

          <p>24hr Free Cancellation</p>
        </li>

        <li>
          <img src="/covid-measures/free-breakfast-icon.svg" alt="" />

          <p>Free Breakfast</p>
        </li>

        <li>
          <img src="/covid-measures/contactless-icon.svg" alt="" />

          <p>Contactless Check In</p>
        </li>

        <li>
          <img src="/covid-measures/health-questionnaire-icon.svg" alt="" />

          <p>Travel Health Questionaire</p>
        </li>

        <li>
          <img src="/covid-measures/open-bar-icon.svg" alt="" />

          <p>Open Bars & Social Areas</p>
        </li>
      </ul>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["journeyUi"]),
  },
};
</script>

<style scoped>
.covid-panel p {
  font-size: 14px;
}

.covid-panel ul {
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.covid-panel li {
  display: flex;
  margin-bottom: 15px;
}

.covid-panel li p {
  margin: 0 0 0 15px;
  font-size: 12px;
  font-weight: 700;
}
</style>
