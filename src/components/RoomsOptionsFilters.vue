<template>
  <v-row no-gutters justify="start" align-content="start">
    <v-col cols="12" class="d-flex flex-wrap">
      <v-badge
        v-for="(translation, filterOption) in content.filterOptions"
        :key="filterOption"
        bordered
        color="secondary"
        icon="mdi-check-bold"
        overlap
        :value="isSelected(filterOption)"
        class="mb-2 mr-4"
      >
        <v-btn @click="updateSelected(filterOption)" text outlined>{{
          translation
        }}</v-btn>
      </v-badge>
    </v-col>

    <v-btn color="secondary" @click="selected = []" outlined>
      <v-icon>mdi-close</v-icon>
      {{ content.clearFilters }}
    </v-btn>
  </v-row>
</template>

<script>
import { bus } from "../plugins/bus";

export default {
  emits: ["room-filters-changed"],
  props: {
    content: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
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
};
</script>

<style lang="css" scoped></style>
