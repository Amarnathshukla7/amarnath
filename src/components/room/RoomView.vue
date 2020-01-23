<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-expansion-panels class="mb-6" multiple v-model="asd">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <div class="font-weight-bold">Shared Rooms</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <card />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Card from "./components/Card.vue";

export default {
  data() {
    return {
      asd: [0, 1]
    };
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped></style>
