<template>
  <section class="search-summary">
    <v-card outlined tile class="search-card my-8 mx-auto pa-5">
      <SearchWidget
        search-btn-txt="Search"
        v-on:search-submitted="switchMode"
        v-if="searchMode"
      />
      <v-row no-gutters v-else>
        <v-col cols="12" sm="10">
          <ul>
            <li class="mr-2 mb-3">
              {{ content.searchingFor }}:
              <strong>{{ hostelShortName(hostel) }}</strong>
            </li>

            <li class="mr-2 mb-3">
              {{ content.for }}:
              <strong>{{ nights }} {{ content.nights }}</strong>
            </li>

            <li class="mr-2 mb-3">
              {{ content.arriving }}:
              <strong>{{ arrival | formatDate(language) }}</strong>
            </li>

            <li>
              {{ content.departing }}:
              <strong>{{ departure | formatDate(language) }}</strong>
            </li>
          </ul>
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn color="secondary" block depressed small @click="switchMode">
            update search
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </section>
</template>

<script>
import { hostelShortName } from "../helpers/hostelNames";
import { formatDate } from "../filters/date";
import SearchWidget from "./SearchWidget";

export default {
  components: {
    SearchWidget,
  },
  props: {
    hostel: {
      type: String,
      default: null,
    },
    nights: {
      type: Number,
      default: null,
    },
    arrival: {
      type: String,
      default: null,
    },
    departure: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      default: "en-GB",
    },
    content: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      searchMode: false,
    };
  },
  filters: {
    formatDate,
  },
  methods: {
    hostelShortName,
    switchMode() {
      console.info("Switching search mode!");
      this.searchMode = !this.searchMode;
    },
  },
};
</script>

<style scoped>
.search-summary {
  padding: 1px 0;
  background-color: #f8f8f8;
}

.search-card p:last-of-type {
  margin-bottom: 0;
}

.search-card ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

@media screen and (min-width: 600px) {
  .search-card li {
    display: inline;
  }
}
</style>
