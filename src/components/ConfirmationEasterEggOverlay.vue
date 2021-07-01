<template>
  <v-overlay data-testid="ceeo_overlay" class="text-center">
    <iframe
      data-testid="ceeo_iframe"
      width="1080"
      height="620"
      src="https://www.youtube-nocookie.com/embed/tBYlNZRi_Jw?controls=0&autoplay=1"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope"
      allowfullscreen
    ></iframe>
    <br />
    <v-btn data-testid="ceeo_btn" x-large icon @click="closeOverlay">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-overlay>
</template>

<script>
export default {
  emits: ["close-overlay"],
  methods: {
    closeOverlay() {
      this.$emit("close-overlay");
    },
  },
};
</script>
