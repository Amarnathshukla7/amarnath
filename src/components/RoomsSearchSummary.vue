<template>
  <section class="search-summary px-5">
    <v-card outlined tile class="search-card my-8 mx-auto pa-5">
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
          <strong>{{ arrival | formatDate }}</strong>
        </li>

        <li>
          {{ content.departing }}:
          <strong>{{ departure | formatDate }}</strong>
        </li>
      </ul>
    </v-card>
  </section>
</template>

<script>
import { hostelShortName } from "../helpers/hostelNames";
import { formatDate } from "../filters/date";

export default {
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
    content: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  filters: {
    formatDate,
  },
  methods: {
    hostelShortName,
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

@media screen and (min-width: 960px) {
  .search-card {
    max-width: 980px;
  }
}
</style>
