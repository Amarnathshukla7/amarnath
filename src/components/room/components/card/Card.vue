<template>
  <v-card
    v-if="!isHidden"
    tile
    class="my-4 room-card"
    :class="{ active: isSelectedAndNotCustom }"
  >
    <v-row no-gutters>
      <v-col cols="12" lg="2" align-self="center">
        <v-img
          class="hidden-md-and-down mx-auto"
          :src="thumb.src"
          :lazy-src="thumb.lzy"
          width="100"
          :aspect-ratio="1"
          @click="index = 0"
        ></v-img>
      </v-col>

      <v-col cols="12" lg="10">
        <v-row no-gutters>
          <v-col cols="12" lg="6">
            <v-card-title
              pa-2
              class="font-weight-bold title"
              :class="selectedAndCustomStylePrimaryColor"
            >
              {{ room.roomName }}
            </v-card-title>

            <v-card-subtitle class="text-left px-3">
              <v-icon
                class="hidden-sm pb-1 mr-1"
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
              <div class="hidden-lg-and-up mt-2 mb-n3">
                <v-row no-gutters align="center">
                  <v-col cols="1">
                    <img
                      src="../../../../assets/icons/check-green.svg"
                      alt=""
                      style="width: 20px"
                    />
                  </v-col>
                  <v-col cols="11">
                    <div
                      class="heading font-weight-bold"
                      :class="{
                        'white--text': isSelectedAndNotCustom,
                        'accent--text': !selected,
                      }"
                    >
                      You're in luck!
                    </div>
                    <div
                      class="caption mb-3"
                      :class="{
                        'white--text': isSelectedAndNotCustom,
                        'accent--text': !selected,
                      }"
                    >
                      This Room has full availability on your chosen dates
                    </div>
                  </v-col>
                </v-row>
              </div>
              <div
                v-if="!oneDayBooking"
                v-show="!customSelected && !room.isCustom"
                class="caption hidden-lg-and-down"
                :class="{
                  'greyish--text': !selected,
                  'white--text': selected,
                }"
              >
                Want to customise your stay? <br />
                Switch to
                <a
                  class="secondary--text"
                  href="javascript:void(0)"
                  @click="switchToCustom"
                >
                  custom booking
                </a>
                instead
              </div>
              <div
                v-if="customSelected"
                class="caption greyish--text hidden-md-and-down"
              >
                Booking your entire stay in this room? <br />
                Switch back to
                <a
                  class="secondary--text"
                  href="javascript:void(0)"
                  @click="customSelected = false"
                >
                  normal booking
                </a>
              </div>
            </v-card-subtitle>
          </v-col>
          <v-col cols="12" lg="6" :align-self="customSelected ? 'end' : ''">
            <v-img
              class="mx-auto hidden-lg-and-up"
              :src="thumb.src"
              :lazy-src="thumb.lzy"
              width="95%"
              max-height="180"
              @click="index = 0"
            ></v-img>

            <!-- Custom Booking Alert -->
            <custom-error
              v-if="room.isCustom"
              :class="{
                white: !selected,
                accent: selected,
              }"
            />

            <div
              class="subtitle-2 text-center my-4 warning--text font-weight-bold"
              v-show="minStay"
            >
              Minimum stay for this room is {{ minStay }} nights. <br />
              <a href="#update-dates" class="warning--text"
                >Please update your search</a
              >
            </div>

            <selection
              v-show="!isCustom && !minStay"
              ref="standardSelection"
              class="pb-2 mt-md-n2 mr-md-n2"
              :price="price"
              :available="available"
              :code="room.code"
              :bed-type="bedType"
              @room-active="val => (selected = val)"
              @update-local-room-cart="updateCart"
            />

            <div
              v-if="!oneDayBooking"
              v-show="!customSelected && !room.isCustom"
              class="caption hidden-lg-and-up text-center mb-4"
              :class="{
                'greyish--text': !selected,
                'white--text': selected,
              }"
            >
              Want to customise your stay? <br />
              Switch to
              <a
                class="secondary--text"
                href="javascript:void(0)"
                @click="switchToCustom"
              >
                custom booking
              </a>
              instead
            </div>
            <div
              v-if="customSelected && !minStay"
              class="caption hidden-lg-and-up text-center mt-4 mb-4"
            >
              Booking your entire stay in this room? <br />
              Switch back to
              <a
                class="secondary--text"
                href="javascript:void(0)"
                @click="customSelected = false"
              >
                normal booking
              </a>
            </div>

            <div v-if="!room.isCustom && !minStay" class="hidden-lg-and-down">
              <v-row no-gutters align="center">
                <v-col cols="1">
                  <img src="../../../../assets/icons/check-green.svg" alt="" />
                </v-col>
                <v-col cols="11">
                  <div
                    class="heading font-weight-bold"
                    :class="{
                      'white--text': isSelectedAndNotCustom,
                      'accent--text': !isSelectedAndNotCustom,
                    }"
                  >
                    You're in luck!
                  </div>
                  <div
                    class="caption mb-3"
                    :class="{
                      'white--text': isSelectedAndNotCustom,
                      'accent--text': !isSelectedAndNotCustom,
                    }"
                  >
                    This Room has full availability on your chosen dates
                  </div>
                </v-col>
              </v-row>
            </div>
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
    <v-row v-show="isCustom" no-gutters justify="center">
      <v-col cols="12" lg="4" v-for="date in customDates" :key="date.date">
        <selection
          :date="date.date"
          :price="date.cost"
          :code="room.code"
          :available="date.units"
          :custom="true"
          @update-local-room-cart="updateCart"
        >
        </selection>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { LightGallery } from "vue-light-gallery";
import { destroy, updateOrCreate } from "../../api/reservation-svc/cart-svc";
import { bus } from "../../../../plugins/bus";
import { filter } from "../../helpers/filters";
import { eachDayOfInterval, subDays, format, differenceInDays } from "date-fns";

export default {
  props: {
    minStay: {
      type: Number,
      default: null,
    },
    checkIn: {
      type: String,
      default: null,
    },
    checkOut: {
      type: String,
      default: null,
    },
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
    Selection: () => import("../selection/Selection.vue"),
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
      customSelected: false,
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
          type: "bed",
          qty: units,
        }));

      return updateOrCreate(this.room.code, dates);
    },
    destroy({ date }) {
      return destroy(this.room.code, date);
    },
    switchToCustom() {
      this.customSelected = true;

      Object.values(this.customDates).forEach(date => {
        bus.$emit(
          "set-room-amount",
          this.room.code,
          date.date,
          this.standardSelected,
        );
      });
    },
    switchToNormal() {},
  },
  computed: {
    customDates() {
      const days = eachDayOfInterval({
        start: new Date(this.checkIn),
        end: new Date(subDays(new Date(this.checkOut), 1)),
      });

      return days.map(date => {
        const day = format(new Date(date), "yyyy-MM-dd");
        const units = this.room.dates[day]
          ? this.room.dates[day].numberOfUnits
          : 0;

        const cost = this.room.dates[day] ? this.room.dates[day].cost : 0;

        return {
          date: day,
          units: parseInt(units),
          cost: cost,
        };
      });
    },
    oneDayBooking() {
      return (
        differenceInDays(new Date(this.checkOut), new Date(this.checkIn)) <= 1
      );
    },
    images() {
      return this.content.images.map(image => ({
        title: image.fields.description,
        url: `${image.fields.file.url}?w=1080&q=85`,
      }));
    },
    thumb() {
      return {
        src: `${this.images[0].url}?w=380&q=75`,
        lzy: `${this.images[0].url}?w=60&q=50`,
      };
    },
    isCustom() {
      return this.room.isCustom || this.customSelected;
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
    standardSelected() {
      return this.$refs.standardSelection.unitsSelected || 0;
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
