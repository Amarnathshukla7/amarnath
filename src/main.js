import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

Vue.use(VueRouter);

Vue.config.productionTip = false;

import RoomAndTransactionView from "./views/RoomAndTransactionView.vue";
import ConfirmationView from "./components/confirmation/ConfirmationView.vue";

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: RoomAndTransactionView },
    { path: "/confirmation", component: ConfirmationView },
  ],
});

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount("#app");
