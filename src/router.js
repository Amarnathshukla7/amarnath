import Vue from "vue";
import VueRouter from "vue-router";
import RoomView from "./views/RoomView.vue";
import TransactionView from "./views/TransactionView.vue";
import ConfirmationView from "./views/ConfirmationView.vue";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: RoomView },
    { path: "/payment", component: TransactionView },
    { path: "/confirmation", component: ConfirmationView },
  ],
});
