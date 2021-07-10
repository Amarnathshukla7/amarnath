<template>
  <v-row class="sort-by--filters my-4" align="start" no-gutters>
    <v-col cols="12" md="6" class="text-left d-flex flex-wrap">
      <v-btn
        @click="showFilters = !showFilters"
        text
        :tile="true"
        outlined
        class="mr-5 mb-2 filters-btn"
      >
        {{ $t("journeyUi.filters.filtersBtn") }}
      </v-btn>

      <v-select
        dense
        class="d-inline-block sort-select mb-1"
        :items="items"
        :label="$t('journeyUi.filters.sortLabel')"
        v-model="sort"
        outlined
        clearable
        item-text="value"
        item-value="key"
      ></v-select>
    </v-col>

    <v-col cols="12">
      <RoomsOptionsFilters v-if="showFilters" />
    </v-col>
  </v-row>
</template>

<script>
import RoomsOptionsFilters from "./RoomsOptionsFilters";

export default {
  emits: ["sort"],
  props: {
    hostelCode: {
      type: String,
      required: true,
    },
  },
  components: {
    RoomsOptionsFilters,
  },
  watch: {
    sort(type) {
      // console.log(type);
      this.$emit("sort", type);
    },
  },
  data() {
    return {
      showFilters: false,
      sort: null,
    };
  },
  computed: {
    items() {
      return [
        {
          key: "price-low",
          value: this.$t("journeyUi.filters.sortOptions.priceLow"),
        },
        {
          key: "price-high",
          value: this.$t("journeyUi.filters.sortOptions.priceHigh"),
        },
        {
          key: "avail-low",
          value: this.$t("journeyUi.filters.sortOptions.availLow"),
        },
        {
          key: "avail-high",
          value: this.$t("journeyUi.filters.sortOptions.availHigh"),
        },
      ];
    },
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
    max-width: 250px;
  }

  .v-input__slot {
    margin: 0;
  }

  .v-input__control {
    background-color: #fff;
  }

  .sort-select .v-input__slot,
  .v-btn:not(.v-btn--round).v-size--default {
    height: 50px;
  }

  .v-select__slot {
    margin-top: 5px;
  }
}

@media screen and (min-width: 960px) {
  .sort-by--filters {
    .covid-measures-btn {
      margin-left: 20px;
    }
  }
}
</style>
