<template>
  <v-overlay class="text-center" :value="loading" z-index="9999">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
    <p>Loading...</p>
  </v-overlay>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
