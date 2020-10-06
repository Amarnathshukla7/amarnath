<template>
  <v-card
    class="mobile-booking-summary"
    tile
    raised
    color="accent pt-2 white--text"
  >
    <v-row no-gutters class="mb-5">
      <v-col cols="6">
        <div class="title font-weight-bold">
          {{ journeyUi.roomsSummary.totalPrice }}:
        </div>
      </v-col>

      <v-col cols="6">
        <div class="title font-weight-bold">{{ cost | formatPrice }}</div>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-btn
          flat
          tile
          width="100%"
          height="64px"
          color="secondary"
          class="font-weight-bold title"
        >
          {{ journeyUi.roomsSummary.ctas.continueMobile }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { formatPrice } from "../../../../filters/money";
import { mapState } from "vuex";

export default {
  props: {
    cost: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState(["journeyUi"]),
  },
  filters: {
    formatPrice,
  },
};
</script>

<style lang="scss" scoped>
.mobile-booking-summary {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1;
}
</style>
