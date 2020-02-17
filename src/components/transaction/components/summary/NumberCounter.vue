<template>
  <number-input v-model="value" :min="0" :max="20" center controls />
</template>

<script>
import Vue from "vue";
import VueNumberInput from "@chenfengyuan/vue-number-input";

Vue.use(VueNumberInput);

export default {
  data() {
    return {
      value: 0,
    };
  },
};
</script>

<style>
.number-input input {
  color: var(--echo-color);
  font-weight: bold;
}
.number-input {
  max-width: 180px !important;
  margin: 15px auto 0px;
}
.upgrade-breakfast figure .number-input__button:hover {
  background: var(--button-hover) !important;
}
</style>
