<script setup lang="ts">
import firebase from "./helpers/firebase";
import { useAppStatus } from "./store/useAppStatus";

const appStore = useAppStatus();
appStore.setFirestore(firebase.firestore);
</script>

<template>
  <router-view />
</template>

<style>
html {
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
:root {
  --headerAndFooterHeight: 110;
  --searchBarHeight: 90;
  --atari2600: linear-gradient(
    186deg,
    rgba(83, 55, 2, 1) 0%,
    rgba(121, 93, 9, 1) 9%,
    rgba(226, 197, 2, 1) 100%
  );
  --msx: linear-gradient(
    186deg,
    rgba(2, 16, 83, 1) 0%,
    rgba(10, 28, 139, 1) 9%,
    rgba(0, 39, 255, 1) 100%
  );
  --amiga: linear-gradient(
    186deg,
    rgba(83, 2, 40, 1) 0%,
    rgba(139, 10, 65, 1) 9%,
    rgba(255, 0, 0, 1) 100%
  );
  --main: linear-gradient(
    186deg,
    rgba(69, 68, 68, 1) 0%,
    rgba(143, 139, 141, 1) 9%,
    rgba(250, 250, 250, 1) 100%
  );
}
.atari2600::-webkit-scrollbar-thumb {
  background-color: rgba(226, 197, 2, 1);
}
.msx::-webkit-scrollbar-thumb {
  background-color: rgba(0, 39, 255, 1);
}
.amiga::-webkit-scrollbar-thumb {
  background-color: rgba(255, 0, 0, 1);
}
::-webkit-scrollbar {
  width: 7px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 20px;
}
::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 20px;
}
</style>
