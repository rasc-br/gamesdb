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
npm install --save-dev eslint eslint-plugin-vue
```

Add configuration information in `package.json`

```
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:vue/vue3-recommended",
      "@vue/typescript/recommended"
    ],
    "parserOptions": {
      "ecmaVersion": 2020
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
      "eslint:recommended",
      "plugin:vue/vue3-recommended",
      "@vue/typescript/recommended",
      "plugin:prettier/recommended"
    ],
```
