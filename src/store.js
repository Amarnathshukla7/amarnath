import Vue from "vue";
import Vuex from "vuex";
import contentful from "./plugins/contentful";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hostel: {},
  },
  mutations: {
    SET_HOSTEL_CONTENT(state, payload) {
      state.hostel = payload;
    },
  },
  actions: {
    async getHostel({ commit }, code) {
      const hostelReq = await contentful.getEntries({
        include: 1,
        content_type: "hostel",
        "fields.code": code,
        select:
          "fields.currency,fields.rooms,fields.code,fields.shortName,fields.streetAddress,fields.gallery,fields.title,fields.mainImage,fields.whatToKnow,fields.extras",
      });

      if (hostelReq.items > 0) {
        commit("SET_HOSTEL_CONTENT", hostelReq.items[0].fields);
      }
    },
  },
});
