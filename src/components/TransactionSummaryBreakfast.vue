<template>
  <section
    v-if="!isError"
    class="primary white--text breakfast--container mt-8"
  >
    <div class="price-container primary">
      <p class="subtitle-2">
        {{ contentTransactionBreakfastUpgrade.price }} <br />
        <span class="title font-weight-bold">{{
          price | formatPrice(currency)
        }}</span>
      </p>
    </div>
    <figure class="text-center">
      <v-img :src="image" max-height="250px"></v-img>
      <h2 v-if="stc" class="mx-2 mt-4 text-justtify subtitle-1">
        {{ contentTransactionBreakfastUpgrade.message }}
        <br />
        <span class="secondary--text font-weight-bold headline">
          {{ contentTransactionBreakfastUpgrade.discount }}
        </span>
      </h2>
      <h2
        v-else
        class="mx-2 mt-4 text-justtify secondary--text font-weight-bold title text-uppercase"
      >
        {{ contentTransactionBreakfastUpgrade.buffet }}
      </h2>
      <v-row align="center">
        <v-col cols="6" offset="1">
          <TransactionSummaryBreakfastCounter
            class="primary--text mb-3"
            id="breakfast-counter"
            @update-value="(val) => (qty = val)"
          />
        </v-col>
        <v-col cols="3" class="text-left">
          <v-btn
            @click="addExtraToCart"
            :disabled="isLoading"
            class="d-inline"
            color="secondary"
          >
            <span v-if="!isLoading" color="white" class="font-weight-bold">
              {{ contentTransactionBreakfastUpgrade.addButton }}
            </span>
            <v-progress-circular
              v-else
              indeterminate
              color="white"
            ></v-progress-circular>
          </v-btn>
        </v-col>
      </v-row>
      <p class="mx-2 my-2 pb-4">
        {{ contentTransactionBreakfastUpgrade.voucherMessage }}
      </p>
    </figure>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import TransactionSummaryBreakfastCounter from "./TransactionSummaryBreakfastCounter.vue";
import { getBreakfastPrice } from "../api/room/search-svc";
import { formatPrice } from "../filters/money";
import { addExtra, deleteExtra } from "../api/transaction/cart-svc";
import { bus } from "../plugins/bus";

export default {
  props: {
    hostelCode: {
      type: String,
      default: null,
    },
    content: {
      type: Object,
      default: null,
    },
    currency: {
      type: String,
      default: "GBP",
    },
    cid: {
      type: String,
      default: null,
      require: true,
    },
  },
  data() {
    return {
      isError: false,
      price: null,
      isLoading: false,
      qty: 0,
    };
  },
  components: {
    TransactionSummaryBreakfastCounter,
  },
  async created() {
    this.isLoading = true;
    this.price = await getBreakfastPrice(this, this.cid);
    if (this.price.error) {
      this.isError = true;
    }
    this.isLoading = false;
  },
  filters: {
    formatPrice,
  },
  methods: {
    async addExtraToCart() {
      this.isLoading = true;
      bus.$emit("cart-updating", true);

      const cart =
        this.qty === 0
          ? await deleteExtra(this, this.content.key, this.cid)
          : await addExtra(
              this,
              [
                {
                  code: this.content.key,
                  name: "breakfast",
                  type: "extra",
                  qty: this.qty,
                },
              ],
              this.cid,
            );

      bus.$emit("cart-transaction-updated", cart);

      this.isLoading = false;
      bus.$emit("cart-updating", false);
    },
  },
  computed: {
    stc() {
      return !this.hostelCode || !["COP", "NOS"].includes(this.hostelCode);
    },
    image() {
      return this.content.image.fields.file.url + "?w=480";
    },
    ...mapGetters("bookingEngine", ["contentTransactionBreakfastUpgrade"]),
  },
};
</script>

<style scoped>
.breakfast--container {
  position: relative;
}

.price-container {
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  height: 120px;
  width: 120px;
  transform: rotate(-15deg);
  text-align: center;
  top: 5px;
  left: 5px;
}

.price-container p {
  top: 25%;
  position: relative;
}

.price-container span {
  margin-top: 10px;
  font-size: 20px;
}
</style>
