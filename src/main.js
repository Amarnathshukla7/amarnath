import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

Vue.use(VueRouter);

Vue.config.productionTip = false;

import RoomView from "./components/room/RoomView.vue";
import TransactionView from "./components/transaction/TransactionView.vue";
import ConfirmationView from "./components/confirmation/ConfirmationView.vue";

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: RoomView },
    { path: "/payment", component: TransactionView },
    { path: "/confirmation", component: ConfirmationView },
  ],
});

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
