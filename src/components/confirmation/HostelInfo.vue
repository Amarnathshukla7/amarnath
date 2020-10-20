<template>
  <v-card tile class="text-center" color="greyback">
    <div
      @click="packBag"
      class="display-1 font-weight-bold greyish--text text-center pt-6"
    >
      PACK YOUR BAGS
    </div>
    <div class="body-2">We look forward to welcoming you at:</div>
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
    <v-btn
      href="https://book.st-christophers.co.uk/manage/index.php?s=entry"
      target="_blank"
      width="80%"
      color="secondary"
      class="subtitle-1 font-weight-bold my-4"
      large
      tile
      depressed
      >Manage my booking</v-btn
    >
  </v-card>
</template>

<script>
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
};
</script>
