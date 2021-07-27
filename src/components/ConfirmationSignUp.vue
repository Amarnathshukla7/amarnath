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
        {{ contentConfirmationSignUp.heading }}
      </div>
      <div class="body-1 white--text text-center font-weight-bold">
        {{ contentConfirmationSignUp.message }}
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
        <span v-if="!signUpSuccessful">{{
          contentConfirmationSignUp.cta.signUp
        }}</span>
        <span v-else>{{ contentConfirmationSignUp.cta.success }}</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  props: {
    reservationId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      signUpSuccessful: false,
    };
  },
  computed: {
    ...mapGetters("bookingEngine", ["contentConfirmationSignUp"]),
  },
  methods: {
    signupToNewsletter() {
      axios.post(`/reservation-svc/${this.reservationId}/user/marketing`);
      this.signUpSuccessful = true;
    },
  },
};
</script>
