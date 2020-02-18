<template>
  <v-card class="mt-4" tile flat>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field label="Enter code" outlined v-model="code"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn
          class="font-weight-bold white--text subtitle-1"
          :disabled="loading"
          color="secondary"
          @click="add"
          width="100%"
          large
          tile
          flat
          height="56"
        >
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="white"
          ></v-progress-circular>
          <span v-else>
            APPLY CODE
          </span>
        </v-btn>
        <span v-if="success" class="accent--text caption font-weight-bold">
          * Code applied succesfully
        </span>
        <span v-if="error" class="warning--text caption font-weight-bold">
          * Code not found
        </span>
      </v-col>
      <v-col>
        <div
          v-for="(error, i) in errors"
          class="warning--text caption font-weight-bold"
          :key="i"
        >
          * {{ error }}
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { discount } from "../api/cart-svc";
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      code: null,
      success: false,
      error: false,
      errors: [],
    };
  },
  methods: {
    async add() {
      this.loading = true;
      this.errors = [];
      this.error = false;

      try {
        const cart = await discount(this.code);
        if (cart.errors) {
          if (cart.errors.length === 1) {
            this.error = true;
            this.loading = false;
            return;
          }

          this.errors = cart.errors;
          this.loading = false;
          return;
        }

        this.success = cart.discount !== 0;
        if (this.success) this.$emit("cart-updated", cart);
      } catch (e) {
        if (e.response.errors) {
          this.errors = e.response.errors;
        }
      }

      this.loading = false;
    },
  },
  computed: {
    loading: {
      get() {
        return this.isLoading;
      },
      set(val) {
        this.$emit("is-loading", val ? val : false);
      },
    },
  },
};
</script>
