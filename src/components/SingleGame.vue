<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAppStatus } from "../store/useAppStatus";
import { useGameStore } from "../store/useGameStore";

const gameStore = useGameStore();
const appStore = useAppStatus();
const { currentGame } = storeToRefs(gameStore);
const { currentConsole } = storeToRefs(appStore);
</script>

<template>
  <q-card ref="singleGameCard" :class="['game-card', currentConsole.name]">
    {{ currentGame.name }}
  </q-card>
</template>

<style lang="scss" scoped>
.game-card {
  width: 80%;
  height: calc(
    100vh - (var(--headerAndFooterHeight) + var(--searchBarHeight) + 50) * 1px
  );
  overflow: hidden;
  padding: 10px;
}
</style>
