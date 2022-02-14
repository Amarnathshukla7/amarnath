import Vue from "vue";
import VueRouter from "vue-router";
import Rooms from "./views/Rooms";
import Transaction from "./views/Transaction.vue";
import Confirmation from "./views/Confirmation.vue";
import Search from "./views/Search.vue";
import cryptoRandomString from "crypto-random-string";

Vue.use(VueRouter);

const cid = cryptoRandomString({ length: 30, type: "url-safe" });
export default new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/search",
    },
    {
      path: "/search",
      component: Search,
    },
    {
      path: "/availability",
      component: Rooms,
      beforeEnter: (to, from, next) => {
        if (!to.query.cid) {
          return next({
            path: to.path,
            query: {
              cid,
              ...to.query,
            },
          });
        }

        return next();
      },
      props: {
        cid,
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
      props: {
        cid,
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
      props: {
        cid,
      },
    },
  ],
});
