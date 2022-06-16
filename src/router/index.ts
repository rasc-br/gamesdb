import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import DevDashboard from "../components/DevDashboard.vue";
import Main from "../views/MainView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/dev",
    name: "DevDashboard",
    component: DevDashboard,
  },
  {
    path: "/",
    component: Main,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
