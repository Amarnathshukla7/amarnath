<template>
  <section>
    <button
      v-for="language in languages"
      :key="language.code"
      @click="setUserLanguage(language.code)"
    >
      {{ language.name }}
    </button>
  </section>
</template>

<script>
export default {
  data() {
    return {
      languages: [
        {
          name: "English",
          code: "en-GB",
          flag: "",
        },
        {
          name: "French",
          code: "fr",
          flag: "",
        },
        {
          name: "German",
          code: "de",
          flag: "",
        },
        {
          name: "Spanish",
          code: "es",
          flag: "",
        },
      ],
    };
  },
  methods: {
    setUserLanguage(code) {
      this.$store.commit("bookingEngine/SET_USER_LANGUAGE", code);
    },
  },
};
</script>

<style scoped>
button {
  border: solid 1px black;
  padding: 1rem;
  margin: 0 1rem;
}
</style>
