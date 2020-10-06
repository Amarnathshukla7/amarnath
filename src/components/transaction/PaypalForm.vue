<template>
  <div id="paypalButton" class="mt-4"></div>
</template>

<script>
import Vue from "vue";
import VueLoadScript from "vue-load-script-plus";
import { create } from "../../api/transaction/transaction-svc";

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
  watch: {
    paypalKey() {
      this.loadScript();
    },
  },
  data() {
    return {
      current: null,
      id: null,
    };
  },
  mounted() {
    this.loadScript();
  },
  methods: {
    loadScript() {
      const url = `https://www.paypal.com/sdk/js?client-id=${this.paypalKey}&intent=authorize&disable-funding=credit,card`;

      this.current ? this.$unloadScript(this.current) : null;
      this.current = `${url}&currency=${this.hostel.currency}`;
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
            onApprove: async (data) => {
              this.$emit("paypal-approved", data);
            },
            onError: (err) => {
              console.log(err);
              this.$emit("paypal-error", err);
            },
            onCancel: (data) => {
              this.$emit("paypal-cancel", data);
            },
          })
          .render("#paypalButton");
      });
    },
  },
  computed: {
    paypalKey() {
      const prodStc =
        "AXfx4NH6VQhmGkPHG9N65iB64y0SpU3ResMVyQUYpB-lIzF_6qat7chVUgUSpnk5q61qV8EAgUIGLE7C";
      const testStc =
        "ARxc7FeK_GnDX3sMagf5x65vS8pr2OjLvAdjhqpoHADQtVNdXwXNOmXgyN07d_22YKM2RXgB8a06HDw7";

      const prodFran =
        "AfLSi5-clDOitgm6ggYQpNUhEiQfDoalSo4Plc2jTOVcH9Voted8MaofnZkzGLeTkgti-ShrWnmU7a3w";
      const testFran =
        "AQ5jPCdxQC-bplqkZHb4q32f6EgsGSUaRMgkxid9NziOaG33vGKGT0wRNC4XZYdzZPzNMQ8DPUNwQGnb";

      if (["COP", "NOS"].includes(this.hostel.code)) {
        return process.env.NODE_ENV === "production" ? prodFran : testFran;
      }

      return process.env.NODE_ENV === "production" ? prodStc : testStc;
    },
  },
};
</script>

<style scoped>
#paypalButton {
  max-width: 220px;
}
</style>
