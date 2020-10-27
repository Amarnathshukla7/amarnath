import Vue from "vue";
import Vuex from "vuex";
import { stcSpaceClient, fpSpaceClient } from "../plugins/contentful";

Vue.use(Vuex);
const hostelClient = stcSpaceClient();
const uiClient = fpSpaceClient();

export default new Vuex.Store({
  state: {
    journeyUi: {},
    hostelData: {},
  },
  mutations: {
    SET_JOURNEY_UI_CONTENT(state, payload) {
      state.journeyUi = payload;
    },
    SET_HOSTEL_CONTENT(state, payload) {
      state.hostelData = payload;
    },
  },
  actions: {
    async getJourneyUi({ commit }) {
      await uiClient
        .getEntries({
          include: 1,
          content_type: "bookingEngineUi",
        })
        .then((response) => {
          commit("SET_JOURNEY_UI_CONTENT", response.items[0].fields);
        });
    },
    async getHostel({ commit }, code) {
      await hostelClient
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
    contentTheBreadCrumbs(state) {
      return state.journeyUi.breadCrumbs;
    },
    contentRoomsOverlayErrors(state) {
      return state.journeyUi.errors;
    },
    contentRoomsSearchSummary(state) {
      return state.journeyUi.searchSummary;
    },
  },
});
