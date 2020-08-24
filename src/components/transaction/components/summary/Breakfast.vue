<template>
  <section v-if="!isError" class="primary white--text breakfast--container mt-8">
    <div class="price-container primary">
      <p class="subtitle-2">
        For only <br />
        <span class="title font-weight-bold">{{
          price | formatPrice(currency)
        }}</span>
      </p>
    </div>
    <figure class="text-center">
      <v-img :src="image" max-height="250px"></v-img>
      <h2 v-if="stc" class="mx-2 mt-4 text-justtify subtitle-1">
        UPGRADE TO COOKED BREAKFAST
        <br />
        <span class="secondary--text font-weight-bold headline">
          AND SAVE 30%
        </span>
      </h2>
      <h2
        v-else
        class="mx-2 mt-4 text-justtify secondary--text font-weight-bold title text-uppercase"
      >
        Include breakfast buffet
      </h2>
      <v-row align="center">
        <v-col cols="6" offset="1">
          <number-counter
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
              Add/Update
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
        You’ll get breakfast voucher(s) on check-in.
      </p>
    </figure>
  </section>
</template>

<script>
import NumberCounter from "./NumberCounter.vue";
import { getBreakfastPrice } from "../../../room/api/search-svc";
import { formatPrice } from "../../../../filters/money";
import { addExtra, deleteExtra } from "../../api/cart-svc";
import { bus } from "../../../../plugins/bus";

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
    NumberCounter,
  },
  async created() {
    this.isLoading = true;
    this.price = await getBreakfastPrice(this.content.key);
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
          ? await deleteExtra(this.content.key)
          : await addExtra([
              {
                code: this.content.key,
                name: "breakfast",
                type: "extra",
                qty: this.qty,
              },
            ]);

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
