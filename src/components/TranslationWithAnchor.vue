<template>
  <div>
    {{ splitText[0] }}
    <a
      class="secondary--text"
      href="javascript:void(0)"
      @click="$emit('linkClicked')"
    >
      {{ splitText[1] }}
    </a>
    {{ splitText[2] }}
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  emits: ["linkClicked"],
  computed: {
    splitText() {
      return this.text.split("@@@");
    },
  },
};
</script>

<style></style>
