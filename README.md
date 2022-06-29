# SIN Games DB

A project created with Vue 3 + TypeScript + Vite + ESLint + Prettier + Quasar + Pinia

## Train of Thought

1. Create an application with VITE

```
npm create vite@latest
```

2. Use VSCode extensions:

- ESLint
- Prettier - Code formatter
- Volar

3. Follow VITE suggestions and use `<script setup>`, to be able to do so: disable in the current Workspace any other Vue tool like `Vetur` and even the built-in `TypeScript and JavaScript Language Features`.

4. Install `eslint`

```
npm install --save-dev eslint eslint-plugin-vue @vue/eslint-config-typescript vue-eslint-parser
```

Add configuration information in `package.json`

```
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true,
      "vue/setup-compiler-macros": true
    },
    "parser": "vue-eslint-parser",
    "extends": [
      "eslint:recommended",
      "plugin:vue/vue3-recommended",
      "@vue/typescript/recommended"
    ],
    "parserOptions": {
      "ecmaVersion": 2022
    },
    "rules": {}
  }
```

5. Install `prettier`

```
npm i --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

And add the configurations extensions
```
    "extends": [
      ...<other rules>...
      "plugin:prettier/recommended"
    ],
```

6. Detailed Explanation:
- To avoid variables not used error inside `<script setup>` and to be able to use `defineProps` and other functions that are injected inside the setup, we use vue parser `"parser": "vue-eslint-parser",` version 9 or above.
- For Prettier work ok with typescript and vue3+setup, we add `"@vue/eslint-config-typescript"`

- Documentation:
https://eslint.vuejs.org/rules/script-setup-uses-vars.html
https://eslint.vuejs.org/user-guide/#compiler-macros-such-as-defineprops-and-defineemits-generate-no-undef-warnings

7. Add VueRouter

```
npm i vue-router
```

- Create a `router` folder inside `src` with a `index.ts` file containing your router information:
```
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Main from '../views/MainView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: Main,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
```
Then at `main.ts` add the Router:
```
import router from './router';

createApp(App).use(router).mount('#app');
```
Note that Vite treats environment variabes different than VueCLI:
https://vitejs.dev/guide/env-and-mode.html

Therefore: `process.env.BASE_URL` will be `import.meta.env.BASE_URL`

8. Add Pinia

```
npm i pinia
```
Update `main.ts`:
```
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).use(router).mount("#app");
```

Create a `store` folder ans set up all store modules there.

9. Add Quasar

Follow: https://quasar.dev/start/vite-plugin

## App creation

1. Fetch from Public API www.igdb.com
2. Set up Firestore to store/fetch new information