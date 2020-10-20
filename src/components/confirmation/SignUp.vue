<template>
  <v-card class="accent" tile>
    <v-img
      height="350px"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
    />
    <v-card-text class="text-center">
      <div
        class="headline mb-1 white--text font-weight-bold text-center text-uppercase"
      >
        {{ journeyUi.signUp.heading }}
      </div>
      <div class="body-1 white--text text-center font-weight-bold">
        {{ journeyUi.signUp.message }}
      </div>
      <v-btn
        large
        tile
        depressed
        :disabled="signUpSuccessful"
        color="secondary"
        class="font-weight-bold mt-4"
        @click="signupToNewsletter"
      >
        <span v-if="!signUpSuccessful">{{ journeyUi.signUp.cta.signUp }}</span>
        <span v-else>{{ journeyUi.signUp.cta.success }}</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      signUpSuccessful: false,
    };
  },
  computed: {
    ...mapState(["journeyUi"]),
  },
  methods: {
    signupToNewsletter() {
      axios.post(`/reservation-svc/${this.reservation.id}/user/marketing`);
      this.signUpSuccessful = true;
    },
  },
};
</script>
