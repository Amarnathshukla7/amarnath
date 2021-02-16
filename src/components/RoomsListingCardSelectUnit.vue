<template>
  <div class="unit--selector">
    <v-select
      class="unit--selector--select pb-0 px-1 pt-2"
      :items="available"
      v-model="selected"
      :placeholder="placehold"
      :readonly="soldOut"
      :rounded="false"
      outlined
      clearable
    >
      <v-tooltip
        v-if="soldOut"
        open-on-hover
        open-on-click
        slot="append"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-icon small v-on="on" color="info" dark> mdi-help </v-icon>
        </template>
        <span>{{ unavailableText[bedType] }}</span>
      </v-tooltip>
    </v-select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    bedType: {
      type: String,
      default: "bed",
    },
    units: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: null,
    },
    unavailableText: {
      type: Object,
      default: null,
    },
  },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  computed: {
    placehold() {
      return this.bedType === "room"
        ? `0 ${this.contentTheSummary.miscContent.rooms}`
        : `0 ${this.contentTheSummary.miscContent.beds}`;
    },
    soldOut() {
      return this.units === 0;
    },
    selected: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update-value", val ? val : 0);
      },
    },
    available() {
      return Array(this.units)
        .fill(null)
        .map((x, i) => i + 1);
    },
    ...mapGetters("bookingEngine", ["contentTheSummary"]),
  },
};
</script>

<style lang="scss">
// .v-menu__content {
//   border-radius: 0 !important;
// }

.unit--selector {
  .v-text-field__details {
    display: none;
  }
  .v-input {
    padding: 10px 15px 2px;
    border-radius: 0;
  }

  .v-input__slot {
    margin: 0;
  }

  .v-input__control {
    background-color: #fff;
  }

  //   .v-select > .v-input__control > .v-input__slot,
  //   .v-card:not(.v-sheet--tile):not(.v-card--shaped),
  //   .v-card > *:last-child:not(.v-btn):not(.v-chip) {
  //     border-radius: 0 !important;
  //   }
}
</style>
