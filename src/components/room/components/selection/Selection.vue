<template>
  <div class="selection">
    <v-card
      outlined
      tile
      class="ma-3 custom-card"
      :class="{ accent: isSelected }"
    >
      <v-row no-gutters>
        <v-col cols="6">
          <unit-select
            :units="available"
            :value="unitsSelected"
            @update-value="update"
          ></unit-select>
        </v-col>
        <v-col cols="6">
          <div
            class="white--text date--price"
            :class="{ accent: !isSoldOut, info: isSoldOut }"
          >
            <div class="heading font-weight-bold">
              <span v-if="date">{{ date }}</span>
              <span v-else>{{ price | formatPrice(currency) }}</span>
            </div>
            <div class="caption mb-0">
              <span v-if="date">{{ price | formatPrice(currency) }}</span>
              <span v-else>Avg price per night</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import UnitSelect from "./UnitSelect.vue";
import { formatPrice } from "../../../../filters/money";
import { bus } from "../../../../plugins/bus";

export default {
  props: {
    code: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    available: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: null,
    },
  },
  components: {
    UnitSelect,
  },
  filters: {
    formatPrice,
  },
  data() {
    return {
      unitsSelected: null,
      hostelConf: null,
    };
  },
  watch: {
    unitsSelected(value) {
      const state = value === 0 ? false : true;
      this.$emit("room-active", state);
      this.$emit("update-local-room-cart", this.cartData);
    },
  },
  computed: {
    isSoldOut() {
      return this.available === 0;
    },
    isSelected() {
      return this.unitsSelected > 0;
    },
    cartData() {
      return {
        date: this.date,
        units: this.unitsSelected,
      };
    },
    currency() {
      return this.hostelConf ? this.hostelConf.currency : "GBP";
    },
  },
  methods: {
    update(value) {
      this.unitsSelected = value;
    },
  },
  async created() {
    bus.$on("set-room-amount", (code, date, value) => {
      if (
        (!date && this.code === code) ||
        (this.date === date && this.code === code)
      )
        this.unitsSelected = value;
    });

    bus.$on("hostel-config.update", conf => (this.hostelConf = conf));
  },
};
</script>

<style lang="scss">
.custom-card .date--price {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.custom-card.theme--light.v-card.v-card--outlined {
  border: 1px solid var(--v-accent-base) !important;
}
</style>
