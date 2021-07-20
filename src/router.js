import Vue from "vue";
import VueRouter from "vue-router";
import Rooms from "./views/Rooms";
import Transaction from "./views/Transaction.vue";
import Confirmation from "./views/Confirmation.vue";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/availability",
    },
    {
      path: "/availability",
      component: Rooms,
    },
    {
      path: "/payment",
      component: Transaction,
    },
    {
      path: "/confirmation",
      component: Confirmation,
    },
  ],
});
