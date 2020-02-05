<template>
  <v-row>
    <v-badge
      v-for="filter in filters"
      :key="filter"
      bordered
      color="secondary"
      icon="mdi-check-bold"
      overlap
      :value="isSelected(filter)"
      class="mr-3"
    >
      <v-btn @click="updateSelected(filter)" text outlined>{{ filter }}</v-btn>
    </v-badge>

    <v-btn color="secondary" @click="selected = []" outlined>
      <v-icon>mdi-close</v-icon>
      Clear All
    </v-btn>
  </v-row>
</template>

<script>
import { bus } from "../../../../plugins/bus";

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
        ? this.selected.filter(i => i !== filter)
        : [...this.selected, filter];
    },
    isSelected(filter) {
      return this.selected.includes(filter);
    },
  },
};
</script>

<style lang="css" scoped></style>
