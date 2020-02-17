<template>
  <section class="confirmation-vue">
    <bread-crumbs :step="4" />
    <div class="confirmation-page-heading">
      <h2>{{ $t("confirmation.thanksHeading") }}</h2>
      <p>{{ $t("confirmation.thanksText") }}</p>
    </div>
    <main>
      <div class="grid-col-1">
        <your-booking />
        <discount-code class="tablet-hide" />
      </div>
      <div class="grid-col-2">
        <manage-booking :items="hostel" />
        <need-to-know :items="hostel.whatToKnow" />
      </div>
      <discount-code class="desktop-hide" />
    </main>
  </section>
</template>

<script>
import BreadCrumbs from "../global/BreadCrumbs.vue";
import YourBooking from "./YourBooking.vue";
import DiscountCode from "./DiscountCode.vue";
import ManageBooking from "./ManageBooking.vue";
import NeedToKnow from "./NeedToKnow.vue";

export default {
  components: {
    BreadCrumbs,
    YourBooking,
    DiscountCode,
    ManageBooking,
    NeedToKnow,
  },
  props: {
    hostel: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style>
.confirmation-vue {
  padding: 0px 0px 50px;
}
.confirmation-vue .confirmation-cont {
  margin-bottom: 30px;
}
.confirmation-vue .confirmation-page-heading {
  text-align: center;
  padding: 30px 15px 15px;
}
.confirmation-vue .confirmation-page-heading h2 {
  color: var(--alpha-color);
  text-transform: uppercase;
  font-family: var(--font-primary);
  font-size: 24px;
  line-height: 0.92;
}
.confirmation-vue .confirmation-page-heading p {
  color: var(--echo-color);
  font-family: var(--font-primary);
  font-size: 14px;
  margin-top: 10px;
}
.confirmation-vue main {
  padding: 0px 15px;
}
@media screen and (max-width: 1000px) {
  .confirmation-vue main .grid-col-1 .tablet-hide {
    display: none;
  }
}
@media screen and (min-width: 700px) {
  .confirmation-vue .confirmation-page-heading h2 {
    font-size: 36px;
  }
  .confirmation-vue .confirmation-page-heading p {
    font-size: 16px;
  }
  .confirmation-vue .confirmation-page-heading {
    padding: 50px 0px 50px;
  }
}
@supports (grid-area: auto) {
  @media screen and (min-width: 1050px) {
    .confirmation-vue main {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      max-width: 1000px;
      margin: auto;
      grid-gap: 30px;
      padding: 0px;
    }
    .confirmation-vue main .grid-col-1 {
      grid-column: 1/6;
    }
    .confirmation-vue main .grid-col-2 {
      grid-column: 6/11;
    }
    .confirmation-vue main .desktop-hide {
      display: none;
    }
  }
}
</style>
