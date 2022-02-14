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
              class="font-weight-bold title room-card__title"
              style="word-wrap: break-word"
              :class="selectedAndCustomStylePrimaryColor"
            >
              {{ content.name }}
            </v-card-title>

            <v-card-subtitle class="text-left px-3">
              <p
                v-show="content.nameDescription"
                class="mb-0 ml-1 body-1"
                :class="{
                  'white--text': isSelectedAndNotCustom,
                  'greyish--text': !isSelectedAndNotCustom,
                }"
              >
                {{ content.nameDescription }}
                <v-tooltip v-if="content.note" bottom right :max-width="320">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      small
                      :color="isSelectedAndNotCustom ? 'white' : 'accent'"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-information
                    </v-icon>
                  </template>
                  <span>{{ content.note }}</span>
                </v-tooltip>
              </p>

              <v-icon
                class="hidden-sm pb-1 mr-1 d-inline-block"
                :class="selectedAndCustomStylePrimaryColor"
              >
                {{ peopleIcon }}
              </v-icon>
              <div
                class="caption d-inline-block"
                :class="selectedAndCustomStylePrimaryColor"
                v-if="uiContent.notePricesPer"
              >
                {{ finalNotePricesPer }}
              </div>

              <div
                v-if="!room.isCustom && !applyMinStay"
                class="hidden-lg-and-up mt-2 mb-n3"
              >
                <v-row no-gutters align="center">
                  <v-col cols="1">
                    <img
                      src="https://storage.googleapis.com/bedsandbars-images/check-green.a92045f4.svg"
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
                      {{ uiContent.inLuck.heading }}
                    </div>
                    <div
                      class="caption mb-3"
                      :class="{
                        'white--text': isSelectedAndNotCustom,
                        'accent--text': !selected,
                      }"
                    >
                      {{ uiContent.inLuck.message }}
                    </div>
                  </v-col>
                </v-row>
              </div>
              <div
                v-if="!oneDayBooking"
                v-show="!customSelected && !room.isCustom"
                class="caption hidden-md-and-down"
                :class="{
                  'greyish--text': !selected,
                  'white--text': selected,
                }"
              >
                {{ uiContent.custom.customQuestion }} <br />
                <TranslationWithAnchor
                  :text="uiContent.custom.customCtaText"
                  @linkClicked="switchToCustom"
                />
              </div>
              <div
                v-if="customSelected"
                class="caption greyish--text hidden-md-and-down"
              >
                {{ uiContent.custom.normalQuestion }} <br />
                <TranslationWithAnchor
                  :text="uiContent.custom.normalCtaText"
                  @linkClicked="customSelected = false"
                />
              </div>
            </v-card-subtitle>
          </v-col>
          <!-- <v-col cols="12" lg="6" :align-self="customSelected ? 'end' : ''"> -->
          <v-col cols="12" lg="6">
            <v-img
              class="mx-auto hidden-lg-and-up"
              :src="thumb.src"
              :lazy-src="thumb.lzy"
              width="95%"
              max-height="180"
              @click="index = 0"
            ></v-img>

            <div
              v-show="depositModelRate === 0"
              class="my-3 my-lg-0 ml-lg-3"
              :class="{
                accent: !isSelectedAndNotCustom,
                tealish: isSelectedAndNotCustom,
              }"
            >
              <p
                class="text-center py-1 font-weight-bold white--text subtitle-2"
              >
                {{ uiContent.freeCancellation }}
                <a
                  class="text-decoration-none"
                  :href="termsLink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <v-icon color="white">mdi-help-circle-outline</v-icon>
                </a>
              </p>
            </div>

            <!-- Custom Booking Alert -->
            <RoomsListingCustomError
              v-if="room.isCustom"
              :class="{
                white: !selected,
                accent: selected,
              }"
            />

            <div
              class="subtitle-2 text-center my-4 warning--text font-weight-bold"
              v-show="applyMinStay"
            >
              {{ finalMinStayText }} <br />
              <a href="#update-dates" class="warning--text">
                {{ uiContent.minStays.updateSearch }}
              </a>
            </div>

            <RoomsListingCardSelect
              v-show="!isCustom && !applyMinStay"
              ref="standardSelection"
              class="pb-2 mt-md-n2 mr-md-n2"
              :price="price"
              :available="available"
              :code="room.code"
              :bed-type="bedType"
              :currency="currency"
              :language="language"
              :unavailableText="uiContent.unavailable"
              @room-active="(val) => (selected = val)"
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
              {{ uiContent.custom.customQuestion }} <br />
              <TranslationWithAnchor
                :text="uiContent.custom.customCtaText"
                @linkClicked="switchToCustom"
              />
            </div>
            <div
              v-if="customSelected && !applyMinStay"
              class="caption hidden-lg-and-up text-center mt-4 mb-4"
            >
              {{ uiContent.custom.normalQuestion }} <br />
              <TranslationWithAnchor
                :text="uiContent.custom.normalCtaText"
                @linkClicked="customSelected = false"
              />
            </div>

            <div
              v-if="!room.isCustom && !applyMinStay"
              class="hidden-md-and-down"
            >
              <v-row no-gutters align="center">
                <v-col cols="1">
                  <img
                    src="https://storage.googleapis.com/bedsandbars-images/check-green.a92045f4.svg"
                    alt=""
                  />
                </v-col>
                <v-col cols="11">
                  <div
                    class="heading font-weight-bold"
                    :class="{
                      'white--text': isSelectedAndNotCustom,
                      'accent--text': !isSelectedAndNotCustom,
                    }"
                  >
                    {{ uiContent.inLuck.heading }}
                  </div>
                  <div
                    class="caption mb-3"
                    :class="{
                      'white--text': isSelectedAndNotCustom,
                      'accent--text': !isSelectedAndNotCustom,
                    }"
                  >
                    {{ uiContent.inLuck.message }}
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

    <!-- Custom Booking -->
    <v-row v-show="isCustom" no-gutters justify="center">
      <v-col cols="12" lg="4" v-for="date in customDates" :key="date.date">
        <RoomsListingCardSelect
          :date="date.date"
          :price="date.cost"
          :code="room.code"
          :bed-type="bedType"
          :available="date.units"
          :currency="currency"
          :language="language"
          :unavailableText="uiContent.unavailable"
          :custom="true"
          @update-local-room-cart="updateCart"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
// Packages
import { eachDayOfInterval, subDays, format, differenceInDays } from "date-fns";
import { LightGallery } from "vue-light-gallery";
import { IMAGE_PLACE_URL } from "../config/external-links";
// APIs
import {
  destroy as destroyCart,
  updateOrCreate as updateOrCreateCart,
} from "../api/room/reservation-svc/cart-svc";

// Plugins & Helpers
import { bus } from "../plugins/bus";
import { filter } from "../helpers/room/filters";
import { formatTimezone } from "../helpers/timezone";

// Components
import RoomsListingCardSelect from "./RoomsListingCardSelect";
import RoomsListingCustomError from "./RoomsListingCustomError";
import TranslationWithAnchor from "./TranslationWithAnchor";
import {
  FLYINGPIG_TERMS_URL,
  COPENHAGENDOWNTOWN_TERMS_URL,
  STCHRISTOPHERS_INN_TERMS_URL,
} from "../config/external-links";

export default {
  props: {
    cid: {
      type: String,
      default: null,
      require: true,
    },
    content: {
      type: Object,
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
    currency: {
      type: String,
      default: "GBP",
    },
    language: {
      type: String,
      default: "en-GB",
    },
    depositModelRate: {
      type: Number,
      default: null,
    },
    hostelCode: {
      type: String,
      required: true,
    },
    minStay: {
      type: Number,
      default: null,
    },
    room: {
      type: Object,
      default: null,
    },
    uiContent: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    LightGallery,
    RoomsListingCardSelect,
    RoomsListingCustomError,
    TranslationWithAnchor,
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
    bus.$on("room-filters-changed", (filters) => {
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
        .filter((data) => (date ? data.date === date : true))
        .map((data) => ({
          code: this.room.code,
          date: data.date,
          name: this.room.roomName,
          type: "bed",
          qty: units,
        }));

      return updateOrCreateCart(this, this.room.code, dates, this.cid);
    },
    destroy({ date }) {
      return destroyCart(this, this.room.code, date, this.cid);
    },
    switchToCustom() {
      this.customSelected = true;

      Object.values(this.customDates).forEach((date) => {
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
        start: formatTimezone(new Date(this.checkIn)),
        end: formatTimezone(new Date(subDays(new Date(this.checkOut), 1))),
      });

      return days.map((date) => {
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
    applyMinStay() {
      return this.minStay
        ? !(
            differenceInDays(
              formatTimezone(new Date(this.checkOut)),
              formatTimezone(new Date(this.checkIn)),
            ) >= this.minStay
          )
        : null;
    },
    oneDayBooking() {
      return (
        differenceInDays(
          formatTimezone(new Date(this.checkOut)),
          formatTimezone(new Date(this.checkIn)),
        ) <= 1
      );
    },
    images() {
      if (!this.content.images)
        return [
          {
            title: "No Image",
            url: IMAGE_PLACE_URL,
          },
        ];

      return this.content.images.map((image) => ({
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
    termsLink() {
      if (["FPU", "FPD"].includes(this.hostelCode)) {
        return FLYINGPIG_TERMS_URL;
      } else if (this.hostelCode == "COP") {
        return COPENHAGENDOWNTOWN_TERMS_URL;
      } else {
        return STCHRISTOPHERS_INN_TERMS_URL;
      }
      // return ["FPU", "FPD"].includes(this.hostelCode)
      //   ? FLYINGPIG_TERMS
      //   : STCHRISTOPHERS_INN_TERMS;
    },
    available() {
      return parseInt(this.room.maxAvailable, 10);
    },
    dates() {
      return Object.keys(this.room.dates).map((date) => ({
        date,
        units: parseInt(this.room.dates[date].numberOfUnits),
        cost: this.room.dates[date].cost,
      }));
    },
    standardSelected() {
      return this.$refs.standardSelection.unitsSelected || 0;
    },
    finalNotePricesPer() {
      const start =
        this.room.roomType === "private"
          ? this.uiContent.notePricesPer.pricesPerRoom
          : this.uiContent.notePricesPer.pricesPerBed;
      const personDescriptor =
        this.maxOccupancy === 1
          ? this.uiContent.notePricesPer.person
          : this.uiContent.notePricesPer.people;
      return `${start} ${this.maxOccupancy} ${personDescriptor}`;
    },
    finalMinStayText() {
      return this.minStay
        ? this.uiContent.minStayText.replace("@@@", this.minStay)
        : "";
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

.v-card__title {
  word-break: break-word;
}

@media screen and (max-width: 1263px) {
  .v-tooltip__content {
    text-align: center;
    left: 20% !important;
    // right: 0;
    // margin: auto;
  }
}

@media screen and (max-width: 959px) {
  .v-tooltip__content {
    text-align: center;
    left: 9% !important;
    // right: 0;
    // margin: auto;
  }
}

@media screen and (max-width: 599px) {
  .v-tooltip__content {
    text-align: center;
    left: 0 !important;
    right: 0;
    margin: auto;
  }
}
</style>
