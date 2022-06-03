import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { Quasar } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

const vueApp = createApp(App);
vueApp
  .use(Quasar, {
    plugins: {},
  })
  .use(createPinia())
  .use(router)
  .mount("#app");
