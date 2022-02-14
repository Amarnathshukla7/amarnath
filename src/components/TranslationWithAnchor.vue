<template>
  <span>
    {{ splitText[0]
    }}<a
      :class="styleClass"
      :href="href"
      :target="target"
      @click.stop="$emit('linkClicked')"
      >{{ splitText[1] }}</a
    >{{ splitText[2] }}
  </span>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    styleClass: {
      type: String,
      default: "secondary--text text-decoration-underline",
    },
    link: {
      type: String,
      default: null,
    },
    target: {
      type: String,
      default: null,
    },
  },
  emits: ["linkClicked"],
  computed: {
    splitText() {
      return this.text.split("@@@");
    },
    href() {
      return this.link || "javascript:void(0)";
    },
  },
};
</script>

<style></style>
