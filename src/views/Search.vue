<template>
  <v-app>
    <main ref="searchView" class="search-view">
      <TheBreadCrumbs
        :steps="viewOptions.steps"
        :current-step-key="viewOptions.currentStepKey"
      />

      <v-card outlined tile class="search-card my-8 mx-auto pa-5">
        <SearchWidget search-btn-txt="Search" />
      </v-card>
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
<style scoped>
.search-card {
  background-color: #f8f8f8;
}
</style>
