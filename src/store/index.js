import Vue from "vue";
import Vuex from "vuex";
import { stcSpaceClient, fpSpaceClient } from "../plugins/contentful";

Vue.use(Vuex);
const hostelClient = stcSpaceClient();
const uiClient = fpSpaceClient();

export const bookingEngine = {
  namespaced: true,
  state: () => ({
    hostelData: {},
    userLanguage: "en-GB",
  }),
  mutations: {
    SET_HOSTEL_CONTENT(state, payload) {
      state.hostelData = payload;
    },
    SET_USER_LANGUAGE(state, payload) {
      state.userLanguage = payload;
    },
  },
  actions: {
    async getHostel({ commit }, code) {
      await hostelClient
        .getEntries({
          include: 1,
          locale: this.state.bookingEngine.userLanguage,
          content_type: "hostel",
          "fields.code": code,
          select:
            "fields.currency,fields.rooms,fields.code,fields.shortName,fields.streetAddress,fields.gallery,fields.title,fields.mainImage,fields.whatToKnow,fields.extras",
        })
        .then((response) => {
          commit("SET_HOSTEL_CONTENT", response.items[0].fields);
        });
    },
    async getHostelConfirmationPageData({ commit }, code) {
      await hostelClient
        .getEntries({
          include: 2,
          content_type: "hostel",
          "fields.code": code,
          select:
            "fields.whatToKnow,fields.hostelPageRef,fields.streetAddress,fields.confirmationEmail,fields.title",
        })
        .then((response) => {
          commit("SET_HOSTEL_CONTENT", response.items[0].fields);
        });
    },
  },
  getters: {
    contentHostelData(state) {
      return state.hostelData;
    },
    getUserLanguage(state) {
      return state.userLanguage;
    },
  },
};

export default new Vuex.Store({
  modules: {
    bookingEngine,
  },
});
