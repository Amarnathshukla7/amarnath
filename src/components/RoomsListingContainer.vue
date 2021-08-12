<template>
  <v-expansion-panel>
    <v-expansion-panel-header color="primary">
      <div class="font-weight-bold white--text text-uppercase heading">
        {{ panelHeader }}
      </div>

      <template v-slot:actions>
        <v-icon color="white">$expand</v-icon>
      </template>
    </v-expansion-panel-header>

    <v-expansion-panel-content ref="sharedRooms" color="info">
      <p
        v-if="!loading && roomsArray.length === 0"
        class="heading font-weight-bold text-center mt-2"
      >
        {{ contentRoomsListingCard.cardLister.noAvailabilityDorms }}
      </p>

      <RoomsListingCard
        v-for="room in roomsArray"
        :content="getRoomContent(contentArray, room.code)"
        :cid="cid"
        :room="room"
        :room-contents="contentArray"
        :key="room.code"
        :check-in="checkIn"
        :check-out="checkOut"
        :min-stay="minStay"
        :currency="currency"
        :language="language"
        :deposit-model-rate="depositModelRate"
        :hostel-code="hostelCode"
        :ui-content="contentRoomsListingCard"
        @update-local-cart="$emit('update-local-cart', $event)"
        @cart-error="isError = true"
      />

      <v-skeleton-loader
        v-if="loading"
        class="mx-auto mt-4"
        type="card"
      ></v-skeleton-loader>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapGetters } from "vuex";
import RoomsListingCard from "./RoomsListingCard";

export default {
  emits: ["update-local-cart", "cart-error"],
  props: {
    cid: {
      type: String,
      default: null,
      require: true,
    },
    panelHeader: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    roomsArray: {
      type: Array,
      default: () => {
        return [];
      },
    },
    contentArray: {
      type: Array,
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
    minStay: {
      type: Number,
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
  },
  methods: {
    getRoomContent(contentArray, roomCode) {
      return contentArray.find((room) => room.fields.roomCode === roomCode)
        .fields;
    },
  },
  components: {
    RoomsListingCard,
  },
  computed: {
    ...mapGetters("bookingEngine", ["contentRoomsListingCard"]),
  },
};
</script>
