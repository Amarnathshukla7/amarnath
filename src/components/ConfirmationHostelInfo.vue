<template>
  <v-card tile class="text-center" color="greyback">
    <div
      @click="packBag"
      class="display-1 font-weight-bold greyish--text text-center pt-6 text-uppercase"
    >
      {{ contentConfirmationHostelInfo.heading }}
    </div>

    <div class="body-2">{{ contentConfirmationHostelInfo.message }}:</div>

    <div class="title font-weight-bold greyish--text">
      {{ hostel.title }}
    </div>

    <div class="body-2 mx-auto mt-4" style="max-width: 70%">
      » {{ hostel.hostelPageRef.fields.tabs[0].fields.phoneNumber }} »
      {{ hostel.confirmationEmail }} » {{ hostel.streetAddress }}
    </div>

    <div
      class="map mt-4"
      v-html="hostel.hostelPageRef.fields.tabs[0].fields.tabsMap"
    ></div>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    hostel: {
      type: Object,
      required: true,
    },
  },
  emits: ["pack-bags"],
  methods: {
    packBag() {
      console.log("pack");
      this.$emit("pack-bags");
    },
  },
  computed: {
    ...mapGetters("bookingEngine", ["contentConfirmationHostelInfo"]),
  },
};
</script>
