<template>
  <div
    v-if="isStatus"
    class="headline primary--text font-weight-bold mb-4 text-center mt-8 mx-auto"
    style="max-width: 620px"
  >
    {{ status }}
  </div>
</template>

<script>
export default {
  props: {
    isStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: null,
    },
  },
};
</script>
