import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/components/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/components/Home.vue"),
  },
  {
    path: "*",
    name: "Login",
    component: () => import("@/components/Login.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

export default router;
