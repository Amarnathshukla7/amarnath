<template>
  <v-row class="sort-by--filters my-4" align="start" no-gutters>
    <v-col cols="12" md="6" class="text-left ml-3">
      <v-btn
        @click="showFilters = !showFilters"
        text
        :tile="true"
        outlined
        class="mr-5 filters-btn"
      >
        {{ journeyUi.filters.filtersBtn }}
      </v-btn>

      <v-select
        dense
        class="d-inline-block sort-select"
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
import Filters from "./Filters";
import CovidMeasures from "./Covid.vue";
import { mapState } from "vuex";

export default {
  props: {
    hostelCode: {
      type: String,
      required: true,
    },
  },
  components: {
    Filters,
    // CovidMeasures,
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
        {
          key: "price-low",
          value: this.$store.state.journeyUi.filters.sortOptions.priceLow,
        },
        {
          key: "price-high",
          value: this.$store.state.journeyUi.filters.sortOptions.priceHigh,
        },
        {
          key: "avail-low",
          value: this.$store.state.journeyUi.filters.sortOptions.availLow,
        },
        {
          key: "avail-high",
          value: this.$store.state.journeyUi.filters.sortOptions.availHigh,
        },
      ],
    };
  },
  computed: {
    showCovidBlock() {
      return !["COP"].includes(this.hostelCode);
    },
    ...mapState(["journeyUi"]),
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

  .sort-select .v-input__slot,
  .v-btn:not(.v-btn--round).v-size--default {
    height: 50px;
  }

  .sort-select .v-input__slot {
    margin-top: 10px;
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

    .v-select__slot {
      margin-top: 0;
    }
  }
}
</style>
