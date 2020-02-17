<template>
  <section class="primary white--text breakfast--container mt-8">
    <div class="price-container primary">
      <p class="subtitle-2">
        For only
        <span class="title font-weight-bold">{{ 3.99 }}</span>
      </p>
    </div>
    <figure class="text-center">
      <v-img
        src="https://images.ctfassets.net/wqkd101r9z5s/3d2CU5bB4RCyV2TKshD1m/6ace02b84780a3b23d1bb7d8ac7f8659/breakfast-pankcakes_4efa4d8f.jpg?h=720"
        max-height="250px"
      ></v-img>
      <h2 class="mx-2 mt-4 text-justtify subtitle-1">
        UPGRADE TO COOKED BREAKFAST
        <br />
        <span class="secondary--text font-weight-bold headline"
          >AND SAVE 30%</span
        >
      </h2>
      <number-counter class="primary--text" id="breakfast-counter" />
      <p class="mx-2 my-2 pb-4">
        You’ll get breakfast voucher(s) on check-in. Can use them to select
        anything from the Belushi’s breakfast menu.
      </p>
    </figure>
  </section>
</template>

<script>
import NumberCounter from "./NumberCounter.vue";

export default {
  components: {
    NumberCounter,
  },
};
</script>

<style>
.breakfast--container {
  position: relative;
}

.price-container {
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  height: 85px;
  width: 85px;
  transform: rotate(-15deg);
  text-align: center;
  top: 5px;
  left: 5px;
}

.price-container p {
  margin-top: 10px;
}

.price-container span {
  margin-top: 10px;
  font-size: 20px;
}
</style>
