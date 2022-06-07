import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Main from "../views/MainView.vue";
import DevDashboard from "../components/DevDashboard.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/dev",
    name: "DevDashboard",
    component: DevDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
