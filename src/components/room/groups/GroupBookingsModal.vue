<template>
  <v-row justify="center">
    <v-dialog v-model="isShowing" max-width="600">
      <v-card>
        <v-card-actions class="text-right mb-n10">
          <v-spacer></v-spacer>
          <v-btn icon @click="isShowing = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-title class="headline mb-4">
          BOOKING FOR A GROUP?
        </v-card-title>

        <v-card-subtitle>
          Looks like you're making a booking for 10+ people, please use our
          dedicated group bookings website
        </v-card-subtitle>

        <v-row class="px-4">
          <v-col cols="12">
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline">Sports</v-card-title>

                  <v-card-subtitle>
                    Watching a big game? On tour with your team? Our hostels are
                    modern and fun, plus we screen live sports
                  </v-card-subtitle>
                </div>

                <v-avatar class="ma-3" size="125" tile>
                  <v-img
                    src="https://storage.googleapis.com/bedsandbars-images/sport_cto.jpg"
                  ></v-img>
                </v-avatar>
              </div>
              <v-card-actions class="">
                <a
                  href="http://www.bookgroups.co.uk/sport-group"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-n2 ml-2 secondary--text font-weight-bold"
                >
                  Click here
                </a>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline">Party</v-card-title>

                  <v-card-subtitle>
                    Got a stag or hen do coming up? Celebrating a birthday? If
                    you need some beds, we have you covered
                  </v-card-subtitle>
                </div>

                <v-avatar class="ma-3" size="125" tile>
                  <v-img
                    src="https://storage.googleapis.com/bedsandbars-images/party_cto.jpg"
                  ></v-img>
                </v-avatar>
              </div>
              <v-card-actions class="">
                <a
                  href="http://www.bookgroups.co.uk/party-group"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-n2 ml-2 secondary--text font-weight-bold"
                >
                  Click here
                </a>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline">Student</v-card-title>

                  <v-card-subtitle>
                    Whether you’re a university student or school group, our
                    cities offer bundles for the budding learner. Our hostels
                    are safe, clean, fun and child-friendly.
                  </v-card-subtitle>
                </div>

                <v-avatar class="ma-3" size="125" tile>
                  <v-img
                    src="https://storage.googleapis.com/bedsandbars-images/student_cto.jpg"
                  ></v-img>
                </v-avatar>
              </div>
              <v-card-actions class="">
                <a
                  href="http://www.bookgroups.co.uk/student-group"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-n2 ml-2 secondary--text font-weight-bold"
                >
                  Click here
                </a>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isShowing: {
      get() {
        return this.show;
      },
      set() {
        this.$emit("hide");
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
