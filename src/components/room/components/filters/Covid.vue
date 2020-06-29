<template>
  <div class="covid-measures">
    <div
      class="covid-btn"
      :class="covidIsOpen ? 'open' : ''"
      @click="toggleCovid()"
    >
      <img
        v-if="covidIsOpen"
        class="new-icon"
        src="@/assets/covid-measures/new-corner-light.svg"
        alt=""
      />

      <img
        v-else
        class="new-icon blink"
        src="@/assets/covid-measures/new-corner.svg"
        alt=""
      />

      <div class="text-icons">
        <img
          v-if="covidIsOpen"
          src="@/assets/covid-measures/icon-shield-white.svg"
          alt=""
          class="shield"
        />

        <img
          v-else
          src="@/assets/covid-measures/icon-shield.svg"
          alt=""
          class="shield"
        />

        <p>Covid Measures</p>

        <img
          v-if="covidIsOpen"
          src="@/assets/covid-measures/minus-icon.svg"
          alt=""
          class="open-toggle"
        />

        <img
          v-else
          src="@/assets/covid-measures/plus-icon.svg"
          alt=""
          class="open-toggle"
        />
      </div>
    </div>

    <transition name="slide-fade">
      <div class="covid-panel" v-show="covidIsOpen">
        <p>
          In response to COVID-19, these additional safety and sanitation
          measures have been added to this property.
        </p>
        <ul>
          <li>
            <img src="@/assets/covid-measures/reduced-dorms-icon.svg" alt="" />

            <p>Reduced Capacity Dorms</p>
          </li>

          <li>
            <img src="@/assets/covid-measures/private-rooms-icon.svg" alt="" />

            <p>Private Dorms for Groups</p>
          </li>

          <li>
            <img
              src="@/assets/covid-measures/social-distancing-icon.svg"
              alt=""
            />

            <p>Social Distancing</p>
          </li>

          <li>
            <img src="@/assets/covid-measures/hand-hygiene-icon.svg" alt="" />

            <p>Hand Hygienization</p>
          </li>

          <li>
            <img src="@/assets/covid-measures/deep-cleaning-icon.svg" alt="" />

            <p>Deep Cleaning & Sanitation</p>
          </li>

          <li>
            <img
              src="@/assets/covid-measures/free-cancellation-icon.svg"
              alt=""
            />

            <p>24hr Free Cancellation</p>
          </li>

          <li>
            <img src="@/assets/covid-measures/free-breakfast-icon.svg" alt="" />

            <p>Free Breakfast</p>
          </li>

          <li>
            <img src="@/assets/covid-measures/contactless-icon.svg" alt="" />

            <p>Contactless Check In</p>
          </li>

          <li>
            <img
              src="@/assets/covid-measures/health-questionnaire-icon.svg"
              alt=""
            />

            <p>Travel Health Questionaire</p>
          </li>

          <li>
            <img src="@/assets/covid-measures/open-bar-icon.svg" alt="" />

            <p>Open Bars & Social Areas</p>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      covidIsOpen: false,
    };
  },
  methods: {
    toggleCovid: function () {
      this.covidIsOpen = !this.covidIsOpen;
    },
  },
};
</script>

<style scoped>
.covid-btn {
  position: relative;
  width: 240px;
  height: 50px;
  /* margin-top: 5px; */
  border: 1px solid #2aa6b9;
  color: #2aa6b9;
  background-color: #fff;
  z-index: 999;
}

.covid-btn.open {
  color: #fff;
  background-color: #2aa6b9;
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-50px);
  opacity: 0;
}

.covid-btn .new-icon {
  width: 50px;
}

.blink {
  animation-name: blinker;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: 3;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.covid-btn .text-icons {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  width: 220px;
  text-align: center;
  font-size: 18px;
  line-height: 18px;
  font-weight: 800;
  overflow: hidden;
}

.covid-btn .shield {
  margin-right: 5px;
}

.covid-btn .text-icons p {
  margin: 0;
}

.covid-btn .open-toggle {
  margin-left: 15px;
}

.covid-panel {
  /* display: none; */
  width: 240px;
  padding: 15px 25px 25px;
  background-color: #e8f5f7;
}

.covid-panel p {
  font-size: 10px;
  line-height: 13px;
  color: #393d41;
}

.covid-panel ul {
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.covid-panel li {
  display: flex;
  margin-bottom: 15px;
}

.covid-panel li p {
  margin: 0 0 0 15px;
  font-size: 12px;
  font-weight: 700;
}
</style>
