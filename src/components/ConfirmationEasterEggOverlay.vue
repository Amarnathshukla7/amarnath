<template>
  <v-overlay class="text-center">
    <iframe
      width="1080"
      height="620"
      src="https://www.youtube-nocookie.com/embed/tBYlNZRi_Jw?controls=0&autoplay=1"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope"
      allowfullscreen
    ></iframe>
    <br />
    <v-btn x-large icon @click="closeOverlay">
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
