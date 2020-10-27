<template>
  <v-row justify="center">
    <v-dialog max-width="600" v-model="show">
      <v-card>
        <v-card-actions class="text-right mb-n10">
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-title class="headline mb-4">
          {{ content.heading }}
        </v-card-title>

        <v-card-subtitle>
          {{ content.message }}
        </v-card-subtitle>

        <v-row class="px-4">
          <v-col cols="12">
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline">
                    {{ content.groupTypes.sports.heading }}
                  </v-card-title>

                  <v-card-subtitle>
                    {{ content.groupTypes.sports.message }}
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
                  {{ content.cta }}
                </a>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline">
                    {{ content.groupTypes.party.heading }}
                  </v-card-title>

                  <v-card-subtitle>
                    {{ content.groupTypes.party.message }}
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
                  {{ content.cta }}
                </a>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="headline">
                    {{ content.groupTypes.student.heading }}
                  </v-card-title>

                  <v-card-subtitle>
                    {{ content.groupTypes.student.message }}
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
                  {{ content.cta }}
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
  emits: ["close-groups-modal"],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    closeModal() {
      this.$emit("close-groups-modal");
    },
  },
};
</script>

<style lang="scss" scoped></style>
