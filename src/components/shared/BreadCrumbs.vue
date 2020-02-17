<template>
  <figure>
    <div class="breadcrumb-container">
      <div class="breadcrumb flat">
        <a href="javascript:void(0)" :class="{ active: step >= 1 }">
          City
        </a>
        <a href="javascript:void(0)" :class="{ active: step >= 2 }">
          Rooms
        </a>
        <a href="javascript:void(0)" :class="{ active: step >= 3 }">
          Payment
        </a>
        <a href="javascript:void(0)" :class="{ active: step >= 4 }">
          Ready
        </a>
      </div>
    </div>
  </figure>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      items: [
        {
          text: "Dashboard",
          disabled: false,
          href: "breadcrumbs_dashboard",
        },
        {
          text: "Link 1",
          disabled: false,
          href: "breadcrumbs_link_1",
        },
        {
          text: "Link 2",
          disabled: true,
          href: "breadcrumbs_link_2",
        },
      ],
    };
  },
};
</script>

<style scoped>
.breadcrumb {
  display: inline-block;
  overflow: hidden;
  counter-reset: flag;
}
.breadcrumb-container {
  margin: 0;
  max-width: 980px;
  margin: auto;
}
.breadcrumb a {
  font-family: var(--font-primary);
  text-transform: uppercase;
  font-weight: bold;
  text-decoration: none;
  outline: none;
  display: block;
  float: left;
  font-size: 12px;
  line-height: 36px;
  color: white;
  padding: 0 10px 0 34px;
  position: relative;
}
.breadcrumb a:first-child {
  padding-left: 20px;
}
.breadcrumb a:last-child {
  padding-left: 32px;
  padding-right: 14px;
}
.breadcrumb a:first-child:before,
.breadcrumb a:last-child:before {
  left: 10px;
}
.breadcrumb a:after {
  content: "";
  position: absolute;
  top: 0;
  right: -18px;
  width: 36px;
  height: 36px;
  transform: scale(0.707) rotate(45deg);
  z-index: 1;
  background: #666;
  background: linear-gradient(135deg, #666, #333);
  box-shadow: 2px -2px 0 2px rgb(255, 255, 255),
    3px -3px 0 2px rgba(255, 255, 255, 0.1);
  border-radius: 0 5px 0 50px;
}
.breadcrumb a:last-child:after {
  content: none;
}
.breadcrumb a:before {
  border-radius: 100%;
  width: 20px;
  width: 10px;
  height: 20px;
  line-height: 20px;
  margin: 8px 0;
  position: absolute;
  top: 0;
  left: 27px;
  font-weight: bold;
}
.flat a,
.flat a:after {
  background: #e6e6e5;
  color: var(--echo-color) !important;
  transition: all 0.5s;
}
.flat a.active,
.flat a.active:after {
  background: var(--v-accent-base);
  color: #fff !important;
}
@media screen and (max-width: 400px) {
  figure .breadcrumb-container {
    max-width: 100%;
  }
}
@media screen and (max-width: 900px) {
  .breadcrumb a .span-mobile-hide {
    display: none;
  }
}
@supports (grid-area: auto) {
  @media screen and (min-width: 400px) {
    .breadcrumb {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin: auto;
    }
    .breadcrumb a {
      padding-left: 43px;
    }
    .breadcrumb a:before {
      content: counter(flag);
      counter-increment: flag;
    }
    .breadcrumb a::before,
    .breadcrumb a:first-child::before {
      left: 30px;
    }
    .breadcrumb a:first-child {
      padding-left: 40px;
      padding-right: 0px;
    }
    .breadcrumb a:last-child {
      padding-left: 42px;
    }
    .breadcrumb a:last-child:before {
      left: 30px;
    }
  }
  @media screen and (min-width: 700px) {
    .breadcrumb a {
      font-size: 16px;
      padding: 10px 30px 10px 75px;
    }
    .breadcrumb a::before {
      font-size: 16px;
      line-height: unset;
      margin: 10px 0;
    }
    .breadcrumb a::after {
      top: 8px;
      right: -17px;
      width: 40px;
      height: 40px;
      transform: scale(1) rotate(45deg);
    }
    .breadcrumb a::before,
    .breadcrumb a:first-child::before {
      left: 56px;
    }
    .breadcrumb a:last-child:before {
      left: 65px;
    }
    .breadcrumb a:last-child {
      padding-left: 85px;
    }
    .breadcrumb a:first-child {
      padding-left: 75px;
    }
    .confirmation-vue figure {
      padding-top: 70px;
    }
  }
}
</style>
