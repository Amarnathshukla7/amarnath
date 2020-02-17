<template>
  <section class="confirmation-discount confirmation-cont">
    <div class="discount-container">
      <p>
        {{ $t("confirmation.getDiscountBadgeGet") }}
        <span>{{ $t("confirmation.getDiscountBadgeDiscount") }}</span>
        <b>{{ $t("confirmation.getDiscountBadgeOff") }}</b>
      </p>
    </div>
    <figure>
      <h2>{{ $t("confirmation.discountHeading") }}</h2>
      <p>{{ $t("confirmation.discountText") }}</p>
      <button>{{ $t("confirmation.discountTweet") }}</button>
    </figure>
  </section>
</template>

<style scoped>
.confirmation-discount {
  background-image: url("../../assets/hostels/LondonHero.jpg");
  background-size: contain;
  background-repeat: no-repeat;
  font-family: var(--font-primary);
  margin: 20px;
  position: relative;
  height: 324px;
  color: #fff;
  max-width: 500px;
  margin: auto;
}
.confirmation-discount .discount-container {
  background: var(--primary-color);
  border-radius: 50%;
  height: 85px;
  width: 85px;
  font-size: 11px;
  transform: rotate(-15deg);
  text-align: center;
  line-height: 1;
  text-transform: uppercase;
  font-weight: bold;
  position: absolute;
  right: -5px;
  top: -5px;
}
.confirmation-discount .discount-container p {
  margin-top: 8px;
}
.confirmation-discount .discount-container span {
  font-size: 39px;
  display: block;
}
.confirmation-discount .discount-container b {
  font-size: 21px;
}
.confirmation-discount figure {
  background: var(--alpha-color);
  padding: 20px 10px;
  margin: 0px;
  position: absolute;
  bottom: 0;
  text-align: center;
}
.confirmation-discount figure h2 {
  margin: 0px;
  text-transform: uppercase;
}
.confirmation-discount figure p {
  font-weight: bold;
  margin-bottom: 20px;
}
.confirmation-discount figure button {
  background: var(--primary-color);
  color: #fff;
  border: 0;
  height: 50px;
  width: 100%;
  font-size: 18px;
  font-family: var(--font-primary);
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  margin-top: 20px;
}
.confirmation-discount figure button:hover {
  background: #a45c0b;
}
@media screen and (min-width: 500px) {
  .confirmation-discount {
    height: 350px;
  }
}
@media screen and (min-width: 1050px) {
  .confirmation-discount {
    margin: 40px 0px 0px 0px;
    height: 380px;
  }
  .confirmation-discount .discount-container {
    left: -5px;
  }
  .confirmation-discount figure {
    padding: 20px;
  }
}
</style>
