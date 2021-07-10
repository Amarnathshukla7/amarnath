<template>
  <v-row justify="center">
    <v-dialog max-width="600" v-model="show">
      <v-card class="pb-5">
        <v-card-actions class="text-right mb-n10">
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-title class="headline mb-4">
          {{ $t("journeyUi.groupModal.heading") }}
        </v-card-title>

        <v-card-subtitle>
          {{ $t("journeyUi.groupModal.text") }}
        </v-card-subtitle>

        <a
          class="cta ml-6"
          href="https://www.st-christophers.co.uk/groups"
          target="_blank"
          >{{ $t("journeyUi.groupModal.cta") }}</a
        >
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  emits: ["close-groups-modal"],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close-groups-modal");
    },
  },
};
</script>

<style lang="scss" scoped>
a.cta {
  color: #ff8700;
}
</style>
