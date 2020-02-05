<template>
  <v-card
    v-if="!isHidden"
    tile
    class="my-6 room-card pa-lg-4"
    :class="{ active: isSelectedAndNotCustom }"
  >
    <v-row no-gutters>
      <v-col cols="12" md="2">
        <v-img
          class="hidden-sm-and-down"
          :src="thumb.src"
          :lazy-src="thumb.lzy"
          width="200"
          :aspect-ratio="1"
          @click="index = 0"
        ></v-img>
      </v-col>

      <v-col cols="12" md="10">
        <v-row no-gutters>
          <v-col cols="12" md="6" lg="6">
            <v-card-title
              pa-2
              class="font-weight-bold subtitle-1"
              :class="selectedAndCustomStylePrimaryColor"
            >
              {{ room.roomName }}
            </v-card-title>

            <v-card-subtitle class="text-left px-3">
              <v-icon
                class="d-inline-block pb-1 mr-1"
                :class="selectedAndCustomStylePrimaryColor"
              >
                {{ peopleIcon }}
              </v-icon>
              <div
                class="caption d-inline-block"
                :class="selectedAndCustomStylePrimaryColor"
              >
                Prices are per {{ bedType }} sleeping {{ maxOccupancy }}
                {{ personDescriptor }}
              </div>
            </v-card-subtitle>
          </v-col>
          <v-col cols="12" md="7" lg="6">
            <v-img
              class="mx-auto hidden-md-and-up"
              :src="thumb.src"
              :lazy-src="thumb.lzy"
              width="95%"
              max-height="180"
              @click="index = 0"
            ></v-img>

            <!-- Custom Booking Alert -->
            <custom-error
              v-if="isCustom"
              :class="{
                white: !selected,
                accent: selected,
              }"
            />

            <selection
              v-if="!isCustom"
              class="pb-2"
              :price="price"
              :available="available"
              :code="room.code"
              @room-active="val => (selected = val)"
              @update-local-room-cart="updateCart"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <LightGallery
      :images="images"
      :index="index"
      :disable-scroll="true"
      @close="index = null"
    />

    <!-- Normal Booking -->
    <!-- <selection
      v-if="!isCustom"
      class="hidden-md-and-up pb-2"
      :price="price"
      :code="room.code"
      :available="available"
      @room-active="val => (selected = val)"
      @update-local-room-cart="updateCart"
    /> -->

    <!-- Custom Booking -->
    <v-row v-if="isCustom" no-gutters justify="center">
      <v-col cols="12" md="4" v-for="date in dates" :key="date.date">
        <selection
          :date="date.date"
          :price="date.cost"
          :code="room.code"
          :available="date.units"
          @update-local-room-cart="updateCart"
        >
        </selection>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { LightGallery } from "vue-light-gallery";
import { destroy, updateOrCreate } from "../api/reservation-svc/cart-svc";
import { bus } from "../../../plugins/bus";
import { filter } from "../helpers/filters";

export default {
  props: {
    room: {
      type: Object,
      default: null,
    },
    roomContents: {
      type: Array,
      default: null,
    },
  },
  components: {
    Selection: () => import("./selection/Selection.vue"),
    CustomError: () => import("./CustomError.vue"),
    LightGallery,
  },
  data() {
    return {
      isActive: false,
      index: null,
      selected: false,
      isLoading: false,
      isHidden: false,
    };
  },
  created() {
    bus.$on("room-filters-changed", filters => {
      this.isHidden =
        filters.length === 0 ? false : filter(this.content, filters);
    });
  },
  methods: {
    async updateCart({ date, units }) {
      this.isLoading = true;
      bus.$emit("cart-updating", true);

      try {
        const cart =
          units === 0
            ? await this.destroy({ date })
            : await this.update({ date, units });
        this.$emit("update-local-cart", cart);
      } catch (e) {
        console.log(e);
        bus.$emit("set-room-amount", this.room.code, date, 0);
        this.$emit("cart-error");
      }

      this.isLoading = false;
      bus.$emit("cart-updating", false);
    },
    update({ date, units }) {
      const dates = this.dates
        .filter(data => (date ? data.date === date : true))
        .map(data => ({
          code: this.room.code,
          date: data.date,
          name: this.room.roomName,
          type: `bed`,
          qty: units,
        }));

      return updateOrCreate(this.room.code, dates);
    },
    destroy({ date }) {
      return destroy(this.room.code, date);
    },
  },
  computed: {
    images() {
      return this.content.images.map(image => ({
        title: image.fields.description,
        url: image.fields.file.url,
      }));
    },
    thumb() {
      return {
        src: `${this.images[0].url}?w=380&q=75`,
        lzy: `${this.images[0].url}?w=60&q=50`,
      };
    },
    isCustom() {
      return this.room.isCustom;
    },
    isSelectedAndNotCustom() {
      return this.selected && !this.isCustom;
    },
    selectedAndCustomStylePrimaryColor() {
      return {
        "primary--text": !this.isSelectedAndNotCustom,
        "white--text": this.isSelectedAndNotCustom,
      };
    },
    maxOccupancy() {
      return parseInt(this.room.maxOccupancy, 10);
    },
    peopleIcon() {
      return this.maxOccupancy === 2 ? "mdi-account-multiple" : "mdi-account";
    },
    personDescriptor() {
      return this.maxOccupancy === 1 ? "person" : "people";
    },
    bedType() {
      return this.room.roomType === "private" ? "room" : "bed";
    },
    price() {
      return this.room.avgRoomPrice;
    },
    available() {
      return parseInt(this.room.maxAvailable, 10);
    },
    dates() {
      return Object.keys(this.room.dates).map(date => ({
        date,
        units: parseInt(this.room.dates[date].numberOfUnits),
        cost: this.room.dates[date].cost,
      }));
    },
    content() {
      return this.roomContents.find(
        room => room.fields.roomCode === this.room.code,
      ).fields;
    },
  },
};
</script>

<style lang="scss">
.active {
  background-color: var(--v-accent-base) !important;
}

.active .primary--text {
  color: #fff !important;
}

// @media screen and (min-width: 1024px) {
//   .room-card .v-image {
//     margin-top: -175px;
//   }
// }

// .v-expansion-panel-content__wrap {
//   padding: 0 12px 16px;
// }

// .v-expansion-panel-header__icon {
//   background-color: var(--v-primary-base);
//   padding: 10px;
// }
</style>
