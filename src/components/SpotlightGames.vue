<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAppStatus } from "../store/useAppStatus";
import CoverImage from "./CoverImage.vue";
import APIService from "../helpers/apiService";
import { useGameStore } from "../store/useGameStore";

const appStore = useAppStatus();
const gameStore = useGameStore();
const { currentConsole } = storeToRefs(appStore);
const { pagination } = storeToRefs(appStore);
const { spotlightGames } = storeToRefs(gameStore);
const limit = 20;
const scrollTargetRef = ref<HTMLElement>();
const retries = ref(0);

async function getMoreCovers(index: number, done: () => void): Promise<void> {
  await getCovers();
  done(); // Review empty or no more covers
}

async function getCovers(): Promise<Record<string, unknown>[]> {
  if (!currentConsole.value.igdbId || retries.value > 3) return [];
  const currentOffset =
    pagination.value[currentConsole.value.name]?.spotlight || 0;
  try {
    const result = await APIService.callIGDB(
      "covers",
      "game, url",
      `where game.platforms = ${currentConsole.value.igdbId}`,
      `limit ${limit}; offset ${currentOffset}`
    );
    const newOffset: number = currentOffset + limit;
    appStore.setPaginationOffset(
      currentConsole.value.name,
      "spotlight",
      newOffset
    );
    if (result.length) {
      retries.value = 0;
      gameStore.setSpotlightGamesCover(result);
      return result;
    }
  } catch (error) {
    console.error("Error fetching covers");
    retries.value += 1;
    return [];
  }
  return [];
}

watch(currentConsole, (newConsole, oldConsole) => {
  if (
    newConsole.name !== oldConsole.name &&
    !spotlightGames.value[newConsole.name]
  )
    getCovers();
});
</script>

<template>
  <q-card ref="scrollTargetRef" class="spotlight-card">
    <q-infinite-scroll
      class="spotlight-session"
      :offset="500"
      :scroll-target="scrollTargetRef"
      @load="getMoreCovers"
    >
      <div
        v-for="spotLightGame in spotlightGames[currentConsole.name]"
        :key="spotLightGame.id"
        class="game-cover"
      >
        <CoverImage :image-url="spotLightGame.cover.url" />
      </div>
      <div class="break"></div>
      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-card>
</template>

<style lang="scss" scoped>
.spotlight-card {
  max-width: 80%;
  height: calc(
    100vh - (var(--headerAndFooterHeight) + var(--searchBarHeight) + 50) * 1px
  );
  overflow: auto;
  padding: 10px;
}
.spotlight-session {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.game-cover {
  margin-bottom: 20px;
}
.break {
  flex-basis: 100%;
  height: 0;
}
</style>
