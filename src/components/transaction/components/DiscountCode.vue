<template>
  <v-card class="mt-4" tile flat>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field label="Enter code" outlined=""></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn
          class="font-weight-bold white--text subtitle-1"
          :disabled="loading"
          color="secondary"
          @click="update"
          width="100%"
          large
          tile
          flat
          height="56"
        >
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="white"
          ></v-progress-circular>
          <span v-else>
            APPLY CODE
          </span>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    update() {
      this.loading = true;
    },
  },
  computed: {
    loading: {
      get() {
        return this.isLoading;
      },
      set(val) {
        this.$emit("is-loading", val ? val : false);
      },
    },
  },
};
</script>
