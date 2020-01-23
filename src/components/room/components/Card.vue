<template>
  <v-card>
    <v-card-title>
      10 Bed Pod Ensuite
    </v-card-title>

    <v-card-subtitle>
      Prices are per pod sleeping 1 people on each
    </v-card-subtitle>

    <v-card-text>
      This is a full availabilty card design style. Background will turn green
      #2AA6B9 on selection of this product.
    </v-card-text>

    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg"
      height="194"
    ></v-img>

    <v-row class="text-center">
      <v-col cols="6" sm="6">
        <v-select :items="[1, 2, 3]" :rounded="false" outlined></v-select>
      </v-col>
      <v-col cols="5">
        <div>
          <p class="body-1 mb-0">£26.50</p>
          <p class="caption">Avg price per night</p>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {};
</script>

<style lang="scss">
.v-expansion-panel-content__wrap {
  padding: 0 12px 16px;
}
</style>
