import Vue from "vue";
import VueRouter from "vue-router";
import Rooms from "./views/Rooms";
import TransactionView from "./views/TransactionView.vue";
import ConfirmationView from "./views/ConfirmationView.vue";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Rooms },
    { path: "/payment", component: TransactionView },
    { path: "/confirmation", component: ConfirmationView },
  ],
});
