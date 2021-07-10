<template>
  <section id="the-language-picker">
    <v-select
      :items="languages"
      item-text="text"
      item-value="code"
      v-model="$i18n.locale"
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
import Trans from "@/plugins/translation";

export default {
  computed: {
    languages() {
      return Trans.supportedLocales;
    },
  },
  mounted() {
    this.$watch(
      "$i18n.locale",
      (newLocale, oldLocale) => {
        if (newLocale === oldLocale) {
          return;
        }

        this.$emit("languageChange", newLocale);
      },
      { immediate: true },
    );
  },
  data() {
    return {
      showText: true,
    };
  },
  props: {
    userLanguage: {
      type: String,
      default: Trans.defaultLocale,
      required: true,
    },
  },
  emits: ["languageChange"],
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
