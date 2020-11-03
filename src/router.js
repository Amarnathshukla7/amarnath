import Vue from "vue";
import VueRouter from "vue-router";
import Rooms from "./views/Rooms";
import Transaction from "./views/Transaction.vue";
import ConfirmationView from "./views/ConfirmationView.vue";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Rooms },
    { path: "/payment", component: Transaction },
    { path: "/confirmation", component: ConfirmationView },
  ],
});
