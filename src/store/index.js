import Vue from "vue";
import Vuex from "vuex";
import { stcSpaceClient, fpSpaceClient } from "../plugins/contentful";

Vue.use(Vuex);
const hostelClient = stcSpaceClient();
const uiClient = fpSpaceClient();

export const bookingEngine = {
  namespaced: true,
  state: () => ({
    isProduction: (process.env.VUE_APP_ENV || "production") === "production",
    journeyUi: {},
    hostelData: {},
    userLanguage: "en-GB",
  }),
  mutations: {
    SET_JOURNEY_UI_CONTENT(state, payload) {
      state.journeyUi = payload;
    },
    SET_HOSTEL_CONTENT(state, payload) {
      state.hostelData = payload;
    },
    SET_USER_LANGUAGE(state, payload) {
      state.userLanguage = payload;
    },
  },
  actions: {
    async getJourneyUi({ commit }) {
      await uiClient
        .getEntries({
          include: 1,
          locale: this.state.bookingEngine.userLanguage,
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
    contentTheBreadCrumbs(state) {
      return state.journeyUi.breadCrumbs;
    },
    contentTheCovidMeasures(state) {
      return state.journeyUi.covidMeasures;
    },
    contentTheSummary(state) {
      return state.journeyUi.roomsSummary;
    },
    contentRoomsOverlayErrors(state) {
      return state.journeyUi.errors;
    },
    contentRoomsSearchSummary(state) {
      return state.journeyUi.searchSummary;
    },
    contentRoomsModalGroupBookings(state) {
      return state.journeyUi.groupModal;
    },
    contentRoomsOptions(state) {
      return state.journeyUi.filters;
    },
    contentRoomsExpansionHeaders(state) {
      return state.journeyUi.expansionPanelHeaders.rooms;
    },
    contentRoomsListingCard(state) {
      return state.journeyUi.roomCard;
    },
    contentTransactionOverlays(state) {
      return state.journeyUi.bookingOverlay;
    },
    contentTransactionSearch(state) {
      return state.journeyUi.mobileSearchSummary;
    },
    contentTransactionPanelHeaders(state) {
      return state.journeyUi.expansionPanelHeaders;
    },
    contentTransactionGuestDetails(state) {
      return state.journeyUi.guestDetailsForm;
    },
    contentTransactionDiscountCode(state) {
      return state.journeyUi.couponCodeForm;
    },
    contentTransactionPaymentForm(state) {
      return state.journeyUi.paymentForm;
    },
    contentTransactionBreakfastUpgrade(state) {
      return state.journeyUi.breakfastUpgrade;
    },
    contentConfirmationThanks(state) {
      return state.journeyUi.thankYouMessage;
    },
    contentConfirmationSummary(state) {
      return state.journeyUi.bookingSummary;
    },
    contentConfirmationSignUp(state) {
      return state.journeyUi.signUp;
    },
    contentConfirmationHostelInfo(state) {
      return state.journeyUi.hostelInfo;
    },
    getUserLanguage(state) {
      return state.userLanguage;
    },
    getIsProduction(state) {
      return state.isProduction;
    },
  },
};

export default new Vuex.Store({
  modules: {
    bookingEngine,
  },
});
