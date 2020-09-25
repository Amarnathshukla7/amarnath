import Vue from "vue";
import Vuex from "vuex";
import contentful from "./plugins/contentful";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hostelData: {},
  },
  mutations: {
    SET_HOSTEL_CONTENT(state, payload) {
      state.hostelData = payload;
    },
  },
  actions: {
    async getHostel({ commit }, code) {
      const hostelReq = await contentful
        .getEntries({
          include: 1,
          content_type: "hostel",
          "fields.code": code,
          select:
            "fields.currency,fields.rooms,fields.code,fields.shortName,fields.streetAddress,fields.gallery,fields.title,fields.mainImage,fields.whatToKnow,fields.extras",
        })
        .then((response) => {
          commit("SET_HOSTEL_CONTENT", response.items[0].fields);
        });
    },
  },
});
