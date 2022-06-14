<script setup lang="ts">
import firebase from "./helpers/firebase";
import { useAppStatus } from "./store/useAppStatus";
import Main from "./views/MainView.vue";

const appStore = useAppStatus();
appStore.setFirestore(firebase.firestore);
</script>

<template>
  <Main />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
