import Vue from "vue";
import VueRouter from "vue-router";
import RoomView from "./components/room/RoomView.vue";
import TransactionView from "./components/transaction/TransactionView.vue";
import ConfirmationView from "./components/confirmation/ConfirmationView.vue";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: RoomView },
    { path: "/payment", component: TransactionView },
    { path: "/confirmation", component: ConfirmationView },
  ],
});
