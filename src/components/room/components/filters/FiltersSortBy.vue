<template>
  <v-row class="sort-by--filters my-4" align="start" no-gutters>
    <v-col cols="12" class="text-left ml-3">
      <v-btn
        @click="showFilters = !showFilters"
        text
        :tile="true"
        outlined
        class="mr-4 mb-2"
      >
        Filters
      </v-btn>
      <v-select
        dense
        class="d-inline-block"
        :items="items"
        label="Sort By"
        v-model="sort"
        outlined
        clearable
        item-text="value"
        item-value="key"
      ></v-select>
    </v-col>
    <v-col cols="12">
      <filters v-if="showFilters" />
    </v-col>
  </v-row>
</template>

<script>
import Filters from "./Filters.vue";

export default {
  components: {
    Filters,
  },
  watch: {
    sort(type) {
      console.log(type);
      this.$emit("sort", type);
    },
  },
  data() {
    return {
      showFilters: false,
      sort: null,
      items: [
        { key: "price-low", value: "Lowest Price" },
        { key: "price-high", value: "Highest Price" },
        { key: "avail-low", value: "Lowest Availability" },
        { key: "avail-high", value: "Highest Availability" },
      ],
    };
  },
};
</script>

<style lang="scss">
.sort-by--filters {
  .v-text-field__details {
    display: none;
  }
  .v-input {
    // padding: 10px 15px 2px;
    border-radius: 0;
    width: 250px;
  }

  .v-input__slot {
    margin: 0;
  }

  .v-input__control {
    background-color: #fff;
  }
}
</style>
