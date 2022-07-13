<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useGameStore } from "../store/useGameStore";
import GameInfo1 from "../components/GameInfo1.vue";

const gameStore = useGameStore();
const { currentGame } = storeToRefs(gameStore);
const componentArray = [GameInfo1];
const page = ref(0);

const currentGameInfo = computed(() => {
  return componentArray[page.value];
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
