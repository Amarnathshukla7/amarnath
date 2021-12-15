<template>
  <v-app>
    <main ref="searchView" class="search-view">
      <TheBreadCrumbs
        :steps="viewOptions.steps"
        :current-step-key="viewOptions.currentStepKey"
      />

      <SearchWidget search-btn-txt="Search" />
    </main>
  </v-app>
</template>

<script>
import SearchWidget from "../components/SearchWidget";
import TheBreadCrumbs from "../components/TheBreadCrumbs";
import SearchViewOptions from "../config/search-view-options";

export default {
  props: {
    viewOptions: {
      type: Object,
      default() {
        return SearchViewOptions;
      },
    },
  },
  components: {
    SearchWidget,
    TheBreadCrumbs,
  },
};
</script>