<template>
  <figure>
    <div class="breadcrumb-container my-8">
      <div class="breadcrumb flat">
        <button
          @click="goTo(step)"
          v-for="(step, stepIndex) in steps"
          :key="step.key"
          :class="{
            active: stepIndex <= currentStepIndex,
            disabled: !step.canVisit,
          }"
        >
          {{ step.displayText }}
        </button>
      </div>
    </div>
  </figure>
</template>

<script>
import { mapState } from "vuex";

export default {
  methods: {
    goTo(step) {
      let currentPath = this.$route.path;
      let nextRouteIndex = this.steps.indexOf(step);

      if (
        !this.canGoBack ||
        nextRouteIndex >= this.currentStepIndex ||
        !step.canVisit
      ) {
        return;
      }

      if (this.steps.keepQueryParams) {
        location.href = location.href.replace(currentPath, step.relativePath);
      } else {
        location.href = step.relativePath;
      }
    },
  },
  computed: {
    /**
     * Returns the current step index.
     */
    currentStepIndex() {
      let currentStepIndexVal = 0;
      this.steps.forEach((step, stepIndex) => {
        if (step.key == this.currentStepKey) {
          currentStepIndexVal = stepIndex;
        }
      });

      return currentStepIndexVal;
    },

    /**
     * Returns the current/active step relative path.
     */
    currentRelativePath() {
      if (
        this.currentStepIndex !== null ||
        this.currentStepIndex !== undefined
      ) {
        return null;
      }

      return this.steps[this.currentStepIndex];
    },
  },
  props: {
    currentStepKey: {
      type: String,
      required: true,
    },
    canGoBack: {
      type: Boolean,
      default: true,
    },
    steps: {
      type: Array,
      default: () => [],
    },
    content: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: inline-block;
  overflow: hidden;
  counter-reset: flag;
}
figure {
  margin: initial !important;
  // background-color: #f8f8f8;
}
.breadcrumb-container {
  margin: 0;
  margin: auto;
  z-index: 0;
  position: relative;
}
.breadcrumb button {
  font-family: $body-font-family;
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
  text-align: left;
}
.breadcrumb button:first-child {
  padding-left: 20px;
}
.breadcrumb button:last-child {
  padding-left: 32px;
  padding-right: 14px;
}
.breadcrumb button:first-child:before,
.breadcrumb button:last-child:before {
  left: 10px;
}
.breadcrumb button:after {
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
.breadcrumb button:last-child:after {
  content: none;
}
.breadcrumb button:before {
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
.flat button,
.flat button:after {
  background: #e6e6e5;
  color: var(--echo-color) !important;
  transition: all 0.5s;
}
.flat button.active,
.flat button.active:after {
  background: var(--v-accent-base);
  color: #fff !important;
}

.flat button.disabled {
  cursor: default;
}

@media screen and (max-width: 360px) {
  .breadcrumb button {
    font-size: 8px;
  }
}
@media screen and (min-width: 361px) and (max-width: 385px) {
  .breadcrumb button {
    font-size: 10px;
  }
}
@media screen and (max-width: 400px) {
  figure .breadcrumb-container {
    max-width: 100%;
    text-align: center;
  }
}
@media screen and (max-width: 900px) {
  .breadcrumb button .span-mobile-hide {
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
    .breadcrumb button {
      padding-left: 43px;
    }
    .breadcrumb button:before {
      content: counter(flag);
      counter-increment: flag;
    }
    .breadcrumb button::before,
    .breadcrumb button:first-child::before {
      left: 30px;
    }
    .breadcrumb button:first-child {
      padding-left: 40px;
      padding-right: 0px;
    }
    .breadcrumb button:last-child {
      padding-left: 42px;
    }
    .breadcrumb button:last-child:before {
      left: 30px;
    }
  }
  @media screen and (min-width: 700px) {
    .breadcrumb button {
      font-size: 16px;
      padding: 10px 30px 10px 75px;
    }
    .breadcrumb button::before {
      font-size: 16px;
      line-height: unset;
      margin: 10px 0;
    }
    .breadcrumb button::after {
      top: 8px;
      right: -17px;
      width: 40px;
      height: 40px;
      transform: scale(1) rotate(45deg);
    }
    .breadcrumb button::before,
    .breadcrumb button:first-child::before {
      left: 56px;
    }
    .breadcrumb button:last-child:before {
      left: 65px;
    }
    .breadcrumb button:last-child {
      padding-left: 85px;
    }
    .breadcrumb button:first-child {
      padding-left: 75px;
    }
    .confirmation-vue figure {
      padding-top: 70px;
    }
  }
}
</style>
