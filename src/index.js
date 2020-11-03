import Rooms from "./views/Rooms";
import Transaction from "./views/Transaction.vue";
import Confirmation from "./views/Confirmation.vue";
import TheBreadCrumbs from "./components/TheBreadCrumbs.vue";
import store from "./store";

function installBookingJourneyStore(localStore) {
  localStore.registerModule("bookingJourney", store);
}

export {
  Rooms,
  Transaction,
  Confirmation,
  TheBreadCrumbs,
  installBookingJourneyStore,
};
