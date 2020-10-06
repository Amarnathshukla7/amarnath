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
          {{ journeyUi.groupModal.heading }}
        </v-card-title>

        <v-card-subtitle>
          {{ journeyUi.groupModal.message }}
        </v-card-subtitle>

        <v-row class="px-4">
          <v-col cols="12">
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline">
                    {{ journeyUi.groupModal.groupTypes.sports.heading }}
                  </v-card-title>

                  <v-card-subtitle>
                    {{ journeyUi.groupModal.groupTypes.sports.message }}
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
                  {{ journeyUi.groupModal.cta }}
                </a>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline">
                    {{ journeyUi.groupModal.groupTypes.party.heading }}
                  </v-card-title>

                  <v-card-subtitle>
                    {{ journeyUi.groupModal.groupTypes.party.message }}
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
                  {{ journeyUi.groupModal.cta }}
                </a>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline">
                    {{ journeyUi.groupModal.groupTypes.student.heading }}
                  </v-card-title>

                  <v-card-subtitle>
                    {{ journeyUi.groupModal.groupTypes.student.message }}
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
                  {{ journeyUi.groupModal.cta }}
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
import { mapState } from "vuex";

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
    ...mapState(["journeyUi"]),
  },
};
</script>

<style lang="scss" scoped></style>
