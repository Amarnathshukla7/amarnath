<template>
  <div>
    <h1 class="display-1 text-uppercase font-weight-bold accent--text">
      {{ journeyUi.thankYouMessage.heading }}
    </h1>
    <p class="body-2">
      {{ journeyUi.thankYouMessage.confirmationMsg }}
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["journeyUi"]),
  },
};
</script>
