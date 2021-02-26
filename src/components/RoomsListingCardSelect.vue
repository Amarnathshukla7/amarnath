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
          <RoomsListingCardSelectUnit
            class="pb-2"
            :class="{ 'pb-md-0': !custom }"
            :units="available"
            :value="unitsSelected"
            :bed-type="bedType"
            :unavailableText="unavailableText"
            @update-value="update"
          />
        </v-col>
        <v-col cols="5" md="5">
          <div
            class="white--text date--price"
            :class="{ accent: !isSoldOut, greyish: isSoldOut }"
          >
            <div
              class="font-weight-bold"
              :class="{
                'subtitle-1': !date,
                'text-sm-h6': !date,
                'subtitle-2': date,
              }"
            >
              <span v-if="date">{{ date | formatDate(language) }}</span>
              <span v-else>{{ price | formatPrice(currency) }}</span>
            </div>
            <div class="font-weight-bold caption mb-0 d-flex justify-center">
              <span
                class="font-weight-bold"
                v-if="date && price > 0"
                :class="{ title: date, 'custom-title': custom }"
                >{{ price | formatPrice(currency) }}</span
              >
              <span v-else-if="price === 0 && date">
                {{ contentRoomsListingCard.selection.soldOut }}
              </span>

              <span v-else class="text-center">
                {{ contentRoomsListingCard.selection.avgMessage }}
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import RoomsListingCardSelectUnit from "./RoomsListingCardSelectUnit";
import { formatPrice } from "../filters/money";
import { bus } from "../plugins/bus";
import { formatDate } from "../filters/date";
import { mapGetters } from "vuex";

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
    language: {
      type: String,
      default: "en-GB",
    },
    unavailableText: {
      type: Object,
      default: null,
    },
  },
  components: {
    RoomsListingCardSelectUnit,
  },
  filters: {
    formatPrice,
    formatDate,
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
    ...mapGetters("bookingEngine", ["contentRoomsListingCard"]),
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

@media screen and (min-width: 1264px) {
  .custom-card .date--price .title.custom-title {
    font-size: 1.15rem !important;
  }
}
</style>
