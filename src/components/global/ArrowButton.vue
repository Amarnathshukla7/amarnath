<template>
  <div class="cta-button">
    <a :href="buttonUrl" :target="newTab ? '_blank' : ''">
      {{ buttonText }}
      <img
        v-if="!noArrow"
        :class="arrowDirection"
        src="../../assets/arrow-right-thin-fff.png"
        alt=""
      >
    </a>
  </div>
</template>

<script>
export default {
  props: {
    buttonText: {
      type: String,
      default: ''
    },
    buttonUrl: {
      type: String,
      default: ''
    },
    horizontalArrow: {
      type: Boolean,
      default: true
    },
    newTab: {
      type: Boolean,
      default: false      
    },
    noArrow: {
      type: Boolean,
      default: false      
    }
  },
  computed: {
    arrowDirection () {
      return this.horizontalArrow ? 'wobble-horizontal' : 'wobble-vertical'
    }
  }
}
</script>

<style scoped>
.cta-button {
  font-size: 18px;
  font-family: proxima-nova, sans-serif;
  color: white;
  font-weight: 900;
  background-color: #ff8700;
  max-width: 250px;
  height: 50px;
  padding: 10px;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 0 !important;
}
.cta-button:hover {
  background: #a45c0b;
}
.cta-button a {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 13px;
  color: white;
  text-decoration: none;
}
@keyframes wobble-horizontal {
  16.65% {
    transform: translateX(8px);
  }
  33.3% {
    transform: translateX(-6px);
  }
  49.95% {
    transform: translateX(4px);
  }
  66.6% {
    transform: translateX(-2px);
  }
  83.25% {
    transform: translateX(1px);
  }
  100% {
    transform: translateX(0);
  }
}
.wobble-horizontal {
  display: inline-block;
  transform: translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
}
.cta-button:hover .wobble-horizontal {
  animation-name: wobble-horizontal;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: 1;
}
/* Wobble Vertical */
@keyframes wobble-vertical {
  16.65% {
    transform: translateY(8px);
  }
  33.3% {
    transform: translateY(-6px);
  }
  49.95% {
    transform: translateY(4px);
  }
  66.6% {
    transform: translateY(-2px);
  }
  83.25% {
    transform: translateY(1px);
  }
  100% {
    transform: translateY(0);
  }
}
.wobble-vertical {
  display: inline-block;
  transform: translateZ(0);
  transform: rotate(90deg);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
}
.cta-button:hover .wobble-vertical {
  animation-name: wobble-vertical;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: 1;
}
.cta-button img {
  width: 19px;
  vertical-align: sub;
  margin-left: 20px;
}
</style>
