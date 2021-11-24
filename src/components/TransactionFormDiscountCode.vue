<template>
  <v-card class="my-1" tile flat>
    <v-row class="">
      <v-col cols="12" md="6">
        <v-text-field
          :label="contentTransactionDiscountCode.coupon.label"
          outlined
          v-model="code"
          class="mb-n10"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6" class="mb-n2 mb-md-n6">
        <v-btn
          class="font-weight-bold white--text subtitle-1"
          :disabled="loading"
          color="secondary"
          @click="add"
          width="100%"
          x-large
          tile
        >
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="white"
          ></v-progress-circular>

          <span v-else>
            {{ contentTransactionDiscountCode.coupon.button }}
          </span>
        </v-btn>
        <span v-if="success" class="accent--text caption font-weight-bold">
          * {{ contentTransactionDiscountCode.coupon.messages.success }}
        </span>
        <span
          v-if="errors.length === 1"
          class="warning--text caption font-weight-bold"
        >
          * {{ contentTransactionDiscountCode.coupon.messages.notFound }}
        </span>
      </v-col>
      <v-col v-if="errors.length > 1">
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
import { mapGetters } from "vuex";
import { discount } from "../api/transaction/cart-svc";

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
      errors: [],
    };
  },
  methods: {
    async add() {
      this.loading = true;
      this.success = false;
      this.errors = [];

      try {
        const cart = await discount(this, this.code, this.$route.query.cid);
        this.success = true;
        this.$emit("cart-updated", cart);
      } catch (e) {
        this.errors = e.response.data.errors;
        this.loading = false;
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
    ...mapGetters("bookingEngine", ["contentTransactionDiscountCode"]),
  },
};
</script>
