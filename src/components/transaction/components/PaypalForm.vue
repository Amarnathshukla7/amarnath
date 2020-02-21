<template>
  <div id="paypalButton" class="mt-4"></div>
</template>

<script>
import Vue from "vue";
import VueLoadScript from "vue-load-script-plus";
import { create } from "../api/transaction-svc";

Vue.use(VueLoadScript);

export default {
  props: {
    hostel: {
      type: Object,
      default: null,
    },
    valid: {
      type: Boolean,
      default: false,
    },
    formRef: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      current: null,
      base:
        "https://www.paypal.com/sdk/js?client-id=sb&intent=authorize&disable-funding=credit,card",
    };
  },
  mounted() {
    this.loadScript();
  },
  methods: {
    loadScript() {
      this.currenct ? this.$unloadScript(this.current) : null;
      this.current = `${this.base}&currency=${this.hostel.currency}`;
      this.$loadScript(this.current).then(() => {
        window.paypal
          .Buttons({
            // onInit is called when the button first renders
            onClick: (data, actions) => {
              if (!this.formRef.validate()) {
                this.$emit("show-validation-error");
                return actions.reject();
              }

              return actions.resolve();
            },
            createOrder: async () => {
              const transaction = await create("paypal");
              return JSON.parse(transaction.secret_output)["id"];
            },
            onApprove: async data => {
              this.$emit("paypal-approved", data);
            },
            onError: err => {
              console.log(err);
              this.$emit("paypal-error", err);
            },
            onCancel: data => {
              this.$emit("paypal-cancel", data);
            },
          })
          .render("#paypalButton");
      });
    },
  },
};
</script>

<style scoped>
#paypalButton {
  max-width: 220px;
}
</style>
