<template>
  <v-expansion-panel class="mb-2">
    <v-expansion-panel-header color="primary">
      <v-img
        max-width="20"
        src="/covid-measures/icon-shield-white.svg"
        class="mr-3"
      ></v-img>

      <div class="font-weight-bold white--text text-uppercase heading">
        {{ panelHeader }}
      </div>

      <template v-slot:actions>
        <v-icon color="white">$expand</v-icon>
      </template>
    </v-expansion-panel-header>

    <v-expansion-panel-content class="covid-panel pa-4">
      <p>
        {{ content.message }}
      </p>

      <ul>
        <li>
          <img src="/covid-measures/private-rooms-icon.svg" alt="" />

          <p>{{ content.measures.privateGroups }}</p>
        </li>

        <li>
          <img src="/covid-measures/social-distancing-icon.svg" alt="" />

          <p>{{ content.measures.socialDistance }}</p>
        </li>

        <li>
          <img src="/covid-measures/hand-hygiene-icon.svg" alt="" />

          <p>{{ content.measures.hands }}</p>
        </li>

        <li>
          <img src="/covid-measures/deep-cleaning-icon.svg" alt="" />

          <p>{{ content.measures.clean }}</p>
        </li>

        <li>
          <img src="/covid-measures/free-cancellation-icon.svg" alt="" />

          <p>{{ content.measures.cancel }}</p>
        </li>

        <li>
          <img src="/covid-measures/free-breakfast-icon.svg" alt="" />

          <p>{{ content.measures.breakfast }}</p>
        </li>

        <li>
          <img src="/covid-measures/contactless-icon.svg" alt="" />

          <p>{{ content.measures.contactless }}</p>
        </li>

        <li>
          <img src="/covid-measures/health-questionnaire-icon.svg" alt="" />

          <p>{{ content.measures.questionaire }}</p>
        </li>

        <li>
          <img src="/covid-measures/open-bar-icon.svg" alt="" />

          <p>{{ content.measures.bars }}</p>
        </li>
      </ul>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    content: {
      type: Object,
      default: () => {
        return {};
      },
    },
    panelHeader: {
      type: String,
      default: "",
    },
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
