<template>
  <v-row dense no-gutters justify="start" align-content="start">
    <v-col
      cols="4"
      sm="2"
      md="1"
      class="mt-2 mr-md-6"
      v-for="filter in filters"
      :key="filter"
    >
      <v-badge
        bordered
        color="secondary"
        icon="mdi-check-bold"
        overlap
        :value="isSelected(filter)"
        class="mr-3"
      >
        <v-btn @click="updateSelected(filter)" text outlined>{{
          filter
        }}</v-btn>
      </v-badge>
    </v-col>

    <v-btn class="mt-2" color="secondary" @click="selected = []" outlined>
      <v-icon>mdi-close</v-icon>
      {{ journeyUi.filters.clearFilters }}
    </v-btn>
  </v-row>
</template>

<script>
import { bus } from "../../../plugins/bus";
import { mapState } from "vuex";

export default {
  data() {
    return {
      filters: ["private", "shared", "female", "ensuite", "couples"],
      selected: [],
    };
  },
  watch: {
    selected() {
      bus.$emit("room-filters-changed", this.selected);
    },
  },
  methods: {
    updateSelected(filter) {
      this.selected = this.selected.includes(filter)
        ? this.selected.filter((i) => i !== filter)
        : [...this.selected, filter];
    },
    isSelected(filter) {
      return this.selected.includes(filter);
    },
  },
  computed: {
    ...mapState(["journeyUi"]),
  },
};
</script>

<style lang="css" scoped></style>
