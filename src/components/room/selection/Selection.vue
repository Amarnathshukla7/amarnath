<template>
  <div class="selection">
    <v-card
      :outlined="custom"
      tile
      flat
      class="ma-2 custom-card"
      :class="{ accent: isSelected }"
    >
      <v-row no-gutters>
        <v-col cols="7" md="7">
          <unit-select
            class="pb-2"
            :class="{ 'pb-md-0': !custom }"
            :units="available"
            :value="unitsSelected"
            :bed-type="bedType"
            @update-value="update"
          ></unit-select>
        </v-col>
        <v-col cols="5" md="5">
          <div
            class="white--text date--price"
            :class="{ accent: !isSoldOut, greyish: isSoldOut }"
          >
            <div
              class="font-weight-bold"
              :class="{ title: !date, 'subtitle-2': date }"
            >
              <span v-if="date">{{ date | formatDate }}</span>
              <span v-else>{{ price | formatPrice(currency) }}</span>
            </div>
            <div class="font-weight-bold caption mb-0">
              <span
                class="font-weight-bold"
                v-if="date && price > 0"
                :class="{ title: date }"
                >{{ price | formatPrice(currency) }}</span
              >
              <span v-else-if="price === 0 && date">
                {{ journeyUi.roomCard.selection.soldOut }}
              </span>

              <span v-else>
                {{ journeyUi.roomCard.selection.avgMessage }}
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import UnitSelect from "./UnitSelect";
import { formatPrice } from "../../../filters/money";
import { bus } from "../../../plugins/bus";
import { format } from "date-fns/esm";
import { formatTimezone } from "../../../helpers/timezone";
import { mapState } from "vuex";

export default {
  props: {
    bedType: {
      type: String,
      default: "bed",
    },
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
    custom: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      default: "GBP",
    },
  },
  components: {
    UnitSelect,
  },
  filters: {
    formatPrice,
    formatDate(date) {
      return format(formatTimezone(new Date(date)), "EEE d MMM");
    },
  },
  data() {
    return {
      unitsSelected: null,
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
    ...mapState(["journeyUi"]),
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
