<template>
  <section class="need-to-know confirmation-cont">
    <h2>{{ $t("confirmation.whatToKnow") }}</h2>
    <ul>
      <li v-for="item in items" :key="item.fields.title">
        <div
          :style="
            `-webkit-mask-image: url(${item.fields.icon.fields.file.url});
          mask-image: url(${item.fields.icon.fields.file.url})`
          "
          class="item-img"
        ></div>
        {{ item.fields.title }}
        <span>{{ item.fields.subtitle }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: null,
    },
  },
};
</script>

<style>
.need-to-know {
  background: #f8f8f8;
  padding: 20px 10px 20px 10px;
  border: dotted 2px var(--bravo-color);
  font-family: var(--font-primary);
  max-width: 500px;
  margin: 20px auto;
}
.need-to-know h2 {
  text-transform: uppercase;
  text-align: center;
  color: var(--delta-color);
  font-size: 22px;
}
.need-to-know h2:after {
  content: "";
  display: block;
  position: relative;
  bottom: 0;
  border-bottom: 4px solid var(--primary-color);
  width: 50px;
  margin: 19.5px auto 40px;
}
.need-to-know ul {
  margin: 0px;
  padding: 0px 10px 0px 4%;
  list-style: none;
}
.need-to-know ul li {
  color: #67868b;
  margin: 15px 0px;
  font-size: 22px;
  font-weight: bold;
  position: relative;
  padding-left: 40px;
}
.need-to-know ul li .item-img {
  background-size: contain;
  display: inline-block;
  background: var(--bravo-color);
  mask-size: contain !important;
  position: absolute;
  left: -5px;
  height: 40px;
  width: 30px;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position-x: center;
}
.need-to-know ul li span {
  color: var(--echo-color);
  display: block;
  font-size: 14px;
  font-weight: normal;
}
.need-to-know ul li span p {
  margin: 5px 0px 20px;
}
.need-to-know ul li a {
  color: var(--bravo-color);
  text-decoration: none;
  border-bottom: 1px dotted var(--bravo-color);
  font-weight: bold;
}
@media screen and (max-width: 899px) {
  .need-to-know ul {
    max-width: 250px;
    margin: auto;
  }
}
@supports (grid-area: auto) {
  @media screen and (min-width: 1050px) {
    .need-to-know {
      margin: 30px 0px 0px;
      border-top: 10px solid var(--bravo-color);
      padding: 30px 25px;
      max-width: unset;
    }
    .need-to-know h2 {
      font-size: 28px;
    }
    .need-to-know ul {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 20px;
      grid-row-gap: 30px;
      padding: 0px;
    }
    .need-to-know ul li {
      margin: 0px;
      padding-left: 40px;
    }
    .need-to-know ul li .item-img {
      width: 34px;
    }
  }
}
</style>
