<template>
  <section class="your-booking confirmation-cont">
    <div class="heading-container">
      <h2>{{ $t("confirmation.bookingReference") }}</h2>
      <h3>STC000123</h3>
    </div>

    <your-booking-breakdown />
  </section>
</template>

<script>
import YourBookingBreakdown from "../global/booking-summary/YourBookingBreakdown.vue";

export default {
  components: {
    YourBookingBreakdown,
  },
};
</script>

<style scoped>
.your-booking {
  margin: 15px auto;
  max-width: 500px;
  border-right: solid 1px #e6e6e5;
  border-left: solid 1px #e6e6e5;
}
.your-booking .heading-container {
  background-color: var(--alpha-color);
  padding: 15px;
  text-align: center;
  color: #fff;
}
.your-booking .heading-container h2,
.your-booking .heading-container h3,
.your-booking ul {
  font-family: var(--font-primary);
  margin: 0px;
}
.your-booking .heading-container h2 {
  font-size: 14px;
}
.your-booking .heading-container h3 {
  font-size: 24px;
  line-height: 1.38;
}

@media screen and (min-width: 1050px) {
  .your-booking {
    margin: 0px;
  }
  .your-booking .heading-container {
    padding: 30px 20px;
  }
  .your-booking .heading-container h2 {
    font-size: 16px;
  }
  .your-booking .heading-container h3 {
    font-size: 36px;
  }
  .your-booking ul li {
    padding: 15px 50px;
  }
}
</style>
