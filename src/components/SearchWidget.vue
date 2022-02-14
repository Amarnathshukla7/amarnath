<template>
  <v-form v-model="isSearchFormValid" @submit.prevent="searchSubmit">
    <v-row justify="center">
      <v-col cols="12" md="4" lg="7">
        <v-autocomplete
          v-model="hostel"
          outlined
          dense
          required
          :items="hostelsFiltered"
          :filter="filterHostel"
          item-value="path"
          item-text="title"
          :hide-details="true"
          :rules="[(v) => !!(v && v.length) || 'Hostel is required']"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3">
        <DatePicker v-model="range" mode="range" :min-date="today" />
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="2">
        <v-btn
          :disabled="!isSearchFormValid"
          class="tw-mt-6 md:tw-mt-0"
          color="secondary"
          block
          depressed
          type="submit"
        >
          {{ searchBtnTxt }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { addDays, differenceInDays, format } from "date-fns";
import { stcSpaceClient } from "../plugins/contentful";
import DatePicker from "v-calendar/lib/components/date-picker.umd";

const client = stcSpaceClient();

export default {
  components: {
    DatePicker,
  },
  name: "SearchWidget",
  emits: ["search-submitted"],
  props: {
    selected: {
      type: String,
      default: null,
    },
    searchBtnTxt: {
      type: String,
      default: "Search",
    },
  },
  data() {
    return {
      isSearchFormValid: false,
      search: null,
      hostels: [],
      hostelsFiltered: [],
      hostel: null,
      show: false,
      today: new Date(),
      range: {
        start: new Date(2018, 0, 16), // Jan 16th, 2018
        end: new Date(2018, 0, 19), // Jan 19th, 2018
      },
    };
  },
  watch: {
    selected(selected) {
      this.hostel = selected;
    },
    range: {
      deep: true,
      handler(range) {
        if (differenceInDays(range.end, range.start) > 14) {
          // eslint-disable-next-line no-console
          this.range.end = addDays(range.start, 14);
          alert(
            "Too many nights selected, please select a range under 14 nights",
          );
        }
      },
    },
  },
  created() {
    const {
      checkIn = new Date(),
      checkOut = addDays(new Date(), 2),
    } = this.$route.query;

    this.range.start = new Date(checkIn);
    this.range.end = new Date(checkOut);

    this.hostel = this.getCurrentHostel();
  },
  async mounted() {
    const excludedCityCodes =
      process.env.NODE_ENV === "production"
        ? "interlaken,brighton,cardiff,copenhagen,prague,noordwijk"
        : "interlaken";

    // Optimize the query all the content can be pulled at ones.
    const cities = await client
      .getEntries({
        content_type: "city",
        select: "fields.code,fields.title",
        order: "fields.title",
        "fields.code[nin]": excludedCityCodes,
      })
      .then((cities) => cities.items);

    this.hostels = await Promise.all(
      cities.map((city) =>
        client
          .getEntries({
            content_type: "hostel",
            select: "fields.code,fields.title,fields.city,fields.slug",
            order: "fields.title",
            "fields.city.sys.id": city.sys.id,
          })
          .then((hostels) => hostels.items),
      ),
    );

    this.prepareList();
  },
  methods: {
    filterHostel(item, queryText, itemText) {
      console.log({
        item,
        queryText,
        itemText,
        found: itemText.toLowerCase().includes(queryText.toLowerCase()),
      });

      if (
        itemText.toLowerCase().includes(queryText.toLowerCase()) ||
        item?.group?.toLowerCase()?.includes(queryText.toLowerCase())
      ) {
        return item;
      }
    },
    prepareList() {
      this.hostelsFiltered = this.hostels.flatMap((destinations) => {
        const arr = [];

        arr.push({
          header: destinations[0].fields.city.fields.title,
        });

        const hostelsMap = destinations.map((destination) => ({
          city: destination.fields,
          path: `${destination.fields.city.fields.code}/${destination.fields.slug}/availability`,
          title: `${destination.fields.title}`,
          group: destinations[0].fields.city.fields.title,
        }));

        arr.push({ divider: true });

        const start = [
          {
            path: null,
            title: "Select a hostel",
          },
        ];

        return [...start, ...arr, ...hostelsMap];
      });
    },
    getCurrentHostel() {
      if (this.$route.params.city && this.$route.params.slug) {
        return `${this.$route.params.city}/${this.$route.params.slug}/availability`;
      }

      return null;
    },
    searchSubmit() {
      this.$emit("search-submitted");
      this.$router.push({
        path: `/${this.hostel}`,
        query: {
          checkIn: format(this.range.start, "yyyy-MM-dd"),
          checkOut: format(this.range.end, "yyyy-MM-dd"),
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.theme--light.v-list-item .v-list-item__mask {
  color: inherit !important;
  background: inherit !important;
}
</style>
