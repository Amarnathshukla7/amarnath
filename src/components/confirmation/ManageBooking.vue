<template>
  <section class="manage-booking confirmation-cont">
    <h2>{{ $t("confirmation.packBagsHeading") }}</h2>
    <h3>
      {{ $t("confirmation.welcomeText") }}
      <span>{{ items.title }}</span>
    </h3>
    <!-- {{ items.basicContentBlocks[1].fields.content }} -->
    <ul>
      <li>+44 (0)207 939 9710</li>
      <li>village1@bedsandbars.com</li>
      <li>{{ items.streetAddress }}</li>
    </ul>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9746.2219347489!2d4.878386!3d52.360347!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb18dfc4ad299b1c8!2sThe%20Flying%20Pig!5e0!3m2!1sen!2suk!4v1568642700207!5m2!1sen!2suk"
      width="100%"
      height="240"
      frameborder="0"
      style="border:0;"
      allowfullscreen=""
    ></iframe>
    <button>{{ $t("confirmation.manageButton") }}</button>
  </section>
</template>

<script>
export default {
  components: {},
  props: {
    items: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style>
.manage-booking {
  background: #f8f8f8;
  padding: 20px 10px 20px 10px;
  border: dotted 2px var(--bravo-color);
  font-family: var(--font-primary);
  max-width: 500px;
  margin: 20px auto;
  color: var(--delta-color);
}
.manage-booking h2 {
  text-transform: uppercase;
  text-align: center;
  font-size: 22px;
}
.manage-booking h2:after {
  content: "";
  display: block;
  position: relative;
  bottom: 0;
  border-bottom: 4px solid var(--primary-color);
  width: 50px;
  margin: 9.5px auto 20px;
}
.manage-booking h3 {
  font-size: 14px;
  text-align: center;
  margin-top: 0px;
  font-weight: lighter;
}
.manage-booking h3 span {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-top: 4px;
}
.manage-booking ul {
  text-align: center;
  list-style: none;
  padding: 0px;
  font-size: 14px;
  line-height: 1.43;
  margin: 15px 0px;
}
.manage-booking ul li:before {
  content: "» ";
}
.manage-booking a {
  color: var(--delta-color);
  text-decoration: none;
}
.manage-booking a:hover {
  text-decoration: underline;
}
.manage-booking button {
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
.manage-booking button:hover {
  background: #a45c0b;
}
@media screen and (min-width: 1050px) {
  .manage-booking {
    margin: 0px;
    border-top: 10px solid var(--bravo-color);
    padding: 30px 20px 20px;
    max-width: unset;
  }
  .manage-booking h2 {
    font-size: 28px;
    margin-top: 0px;
  }
  .manage-booking h3 span {
    font-size: 24px;
  }
  .manage-booking ul {
    margin-bottom: 30px;
  }
  .manage-booking ul li {
    display: inline-block;
    margin-right: 5px;
  }
  .manage-booking button {
    margin-top: 30px;
  }
}
</style>
