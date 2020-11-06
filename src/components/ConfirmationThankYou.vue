<template>
  <div>
    <h1 class="display-1 text-uppercase font-weight-bold accent--text">
      {{ contentConfirmationThanks.heading }}
    </h1>
    <p class="body-2">
      {{ contentConfirmationThanks.confirmationMsg }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("bookingEngine", ["contentConfirmationThanks"]),
  },
};
</script>
