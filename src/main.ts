import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { Quasar, Notify } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import "quasar/src/css/index.sass";

const vueApp = createApp(App);
vueApp
  .use(Quasar, {
    plugins: { Notify },
  })
  .use(createPinia())
  .use(router)
  .mount("#app");
