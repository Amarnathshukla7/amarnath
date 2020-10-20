<template>
  <v-card class="accent" tile>
    <v-img
      height="350px"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
    />
    <v-card-text class="text-center">
      <div class="headline mb-1 white--text font-weight-bold text-center">
        YOUR NEXT BOOKING
      </div>
      <div class="body-1 white--text text-center font-weight-bold">
        Sign up to our newsletter to reveal a 10% discount code below
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
        <span v-if="!signUpSuccessful">Sign Up!</span>
        <span v-else>Successfully Signed Up!</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      signUpSuccessful: false,
    };
  },
  methods: {
    signupToNewsletter() {
      axios.post(`/reservation-svc/${this.reservation.id}/user/marketing`);
      this.signUpSuccessful = true;
    },
  },
};
</script>
