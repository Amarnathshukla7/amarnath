<template>
  <v-overlay
    class="text-center"
    :value="$parent.isLoadingOverlay"
    :opacity="0.8"
  >
    <v-progress-circular indeterminate size="64"></v-progress-circular>

    <div
      v-if="$parent.isLoadingReservation"
      style="max-width: 620px"
      class="heading mt-10 px-6"
    >
      Please wait while we confirm your payment and booking. This might take up
      to 30 seconds or more on slow internet connections. Please be patient
    </div>
  </v-overlay>
</template>

<script>
export default {};
</script>
