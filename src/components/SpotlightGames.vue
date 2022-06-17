<script setup lang="ts">
import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAppStatus } from "../store/useAppStatus";
import CoverImage from "./CoverImage.vue";
import APIService from "../helpers/apiService";
import { useGameStore } from "../store/useGameStore";

const appStore = useAppStatus();
const gameStore = useGameStore();
const { currentConsole } = storeToRefs(appStore);

async function getMoreCovers(
  index = 0,
  done = () => {
    return;
  }
) {
  const covers = await getCovers();
  gameStore.setSpotlightGamesCover(covers);
  console.log(index);
  done();
}

async function getCovers(): Promise<Record<string, unknown>[]> {
  if (!currentConsole.value.igdbId) return [];
  const result = await APIService.callIGDB(
    "covers",
    "game, url",
    `where game.platforms = ${currentConsole.value.igdbId}`
  );
  if (result.length) return result;
  return [];
}
watch(currentConsole, (newConsole, oldConsole) => {
  if (newConsole.name !== oldConsole.name) getMoreCovers();
});
onMounted(async () => {
  getMoreCovers();
});

const { spotlightGames } = storeToRefs(gameStore);
</script>

<template>
  <q-card class="spotlight-card">
    <q-card-section>
      <q-infinite-scroll :offset="500" class="spotlight-session">
        <div
          v-for="(spotLightGame, index) in spotlightGames"
          :key="index"
          class="game-cover"
        >
          <CoverImage :image-url="spotLightGame.cover.url" />
        </div>
        <template #loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.spotlight-card {
  max-width: 80%;
  height: calc(
    100vh - (var(--headerAndFooterHeight) + var(--searchBarHeight) + 50) * 1px
  );
  overflow: auto;
}
.spotlight-session {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.game-cover {
  margin-bottom: 20px;
}
</style>
