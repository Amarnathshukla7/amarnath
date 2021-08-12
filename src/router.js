import Vue from "vue";
import VueRouter from "vue-router";
import Rooms from "./views/Rooms";
import Transaction from "./views/Transaction.vue";
import Confirmation from "./views/Confirmation.vue";
import cryptoRandomString from "crypto-random-string";

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
      beforeEnter: (to, from, next) => {
        if (!to.query.cid) {
          return next({
            path: to.path,
            query: {
              cid: cryptoRandomString({ length: 30, type: "url-safe" }),
              ...to.query,
            },
          });
        }
    
        return next();
      },
    },
    {
      path: "/payment",
      component: Transaction,
      beforeEnter: (to, from, next) => {
        if (!to.query.cid) {
          return next({
            path: "/",
          });
        }
    
        return next();
      },
    },
    {
      path: "/confirmation",
      component: Confirmation,
      beforeEnter: (to, from, next) => {
        if (!to.query.cid) {
          return next({
            path: "/",
          });
        }
    
        return next();
      },
    },
  ],
});
