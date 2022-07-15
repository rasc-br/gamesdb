<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useGameStore } from "../store/useGameStore";
import { useAppStatus } from "../store/useAppStatus";
import GameInfo1 from "../components/GameInfo1.vue";
import GameInfo2 from "../components/GameInfo2.vue";

const gameStore = useGameStore();
const appStore = useAppStatus();
const { currentGame } = storeToRefs(gameStore);
const { gameInfoPage } = storeToRefs(appStore);
const componentArray = [GameInfo1, GameInfo2];

const currentGameInfo = computed(() => {
  // const currentValue =
  //   gameInfoPage.value >= 0
  //     ? gameInfoPage.value
  //     : Math.abs(gameInfoPage.value) + 1;
  const currentValue = Math.abs(gameInfoPage.value);
  const page =
    (currentValue % componentArray.length || componentArray.length) - 1;
  console.log("gameInfoPage:", gameInfoPage.value);
  console.log("page:", page);
  return componentArray[page];
});
</script>

<template>
  <q-card ref="singleGameCard" class="game-card">
    <q-card-section class="title">
      <div class="text-h6">{{ currentGame.name }}</div>
    </q-card-section>
    <div class="transition-container">
      <Transition name="move-cards">
        <component :is="currentGameInfo" />
      </Transition>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.game-card {
  --mainCardHeight: calc(
    100vh - (var(--headerAndFooterHeight) + var(--searchBarHeight) + 50) * 1px
  );
  width: 80%;
  height: var(--mainCardHeight);
  overflow: hidden;
  padding: 10px;
}
.title {
  padding: 0px;
}
</style>
