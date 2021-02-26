<template>
  <section id="the-language-picker">
    <!-- <button
      v-for="language in languages"
      :key="language.code"
      @click="setUserLanguage(language.code)"
    >
      {{ language.text }}
    </button> -->
    <v-select
      :items="languages"
      item-text="text"
      item-value="code"
      v-model="selectedLanguage"
      append-icon=""
      large
    >
      <template #selection="{ item }">
        <img class="the-language-picker-selection-image" :src="item.flag" />
      </template>
      <template #item="{ item }">
        <img
          class="the-language-picker-dropdown-item-image"
          :src="item.flag"
        /><span class="the-language-picker-dropdown-item-text">
          {{ showText ? item.text : "" }}</span
        >
      </template>
    </v-select>
  </section>
</template>

<script>
export default {
  data() {
    return {
      showText: true,
      selectedLanguage: this.userLanguage,
      languages: [
        {
          text: "English",
          code: "en-GB",
          flag:
            "https://images.ctfassets.net/4mnpckaz5cg6/7blI7R03OeOjpLZRmxJqgs/3603dd177b3be067c3c81f3f5a96851e/british-flag.svg",
        },
        {
          text: "Français",
          code: "fr",
          flag:
            "https://images.ctfassets.net/4mnpckaz5cg6/2U2SDTBhtXCUaOROaCMhVx/a41103c3c31e1b780ab390fbcba3a729/french-flag.svg",
        },
        {
          text: "Deutsch",
          code: "de",
          flag:
            "https://images.ctfassets.net/4mnpckaz5cg6/c3j2VkwHW17Cpf52q9yp2/dd92f2e003a5763060e775100d8b1f2a/german-flag.svg",
        },
        {
          text: "Español",
          code: "es",
          flag:
            "https://images.ctfassets.net/4mnpckaz5cg6/1kqHQeUE4QEsw0K2qMfdqp/55c3f271c1154ed83f7a47a818a5289c/spanish-flag.svg",
        },
      ],
    };
  },
  props: {
    userLanguage: {
      type: String,
      default: "en-GB",
      required: true,
    },
  },
  emits: ["languageChange"],
  watch: {
    selectedLanguage() {
      //   this.$store.commit(
      //     "bookingEngine/SET_USER_LANGUAGE",
      //     this.selectedLanguage,
      //   );
      this.$emit("languageChange", this.selectedLanguage);
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

<style>
#the-language-picker .v-text-field > .v-input__control > .v-input__slot:before,
#the-language-picker .v-text-field > .v-input__control > .v-input__slot:after {
  content: none;
}

#the-language-picker .v-select__selections {
  justify-content: center;
}

#the-language-picker .v-select__selections input {
  display: none;
}

#app .the-language-picker-selection-image {
  height: 2.25em;
  margin-top: 7px;
}

#app .the-language-picker-dropdown-item-image {
  margin-right: 0.5rem;
  height: 2.25em;
}
</style>
