<script setup lang="ts">
import { computed, Ref, ref, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useAppStatus } from "../store/useAppStatus";
import CoverImage from "./CoverImage.vue";
import APIService from "../helpers/apiService";
import { useGameStore } from "../store/useGameStore";
import { GamesGroup } from "../types";
import { QInfiniteScroll } from "quasar";

const appStore = useAppStatus();
const gameStore = useGameStore();
const { currentConsole } = storeToRefs(appStore);
const { pagination } = storeToRefs(appStore);
const { searchText } = storeToRefs(appStore);
const { searchGames } = storeToRefs(gameStore);
const limit = 20;
const scrollTargetRef = ref<HTMLElement>();
const infiniteScroll = ref<QInfiniteScroll>();
const retries = ref(0);
const loading = ref(false);
const lastFetchAmount = ref(0);
const gamesType: Ref<"spotlight" | "search"> = ref("spotlight");

// Checks search text to switch between spotlight and search
// Gets more cover with new parameters
watch(searchText, (newValue, oldValue) => {
  if (newValue === oldValue) return;
  lastFetchAmount.value = limit;
  searchGames.value = {} as GamesGroup;
  if (!newValue) {
    nextTick(() => (gamesType.value = newValue ? "search" : "spotlight"));
    return;
  }
  gamesType.value = newValue ? "search" : "spotlight";
  pagination.value[currentConsole.value.name].search = 0;
  getCovers();
});

// Checks console changes and gets more cover with new parameter
watch([currentConsole], () => {
  searchText.value = "";
  if (games.value[currentConsole.value.name]) return;
  retries.value = 0;
  lastFetchAmount.value = limit;
  getCovers();
});

// Contains games to be shown
const games: Ref<GamesGroup> = computed(() => {
  const gamesGroup:
    | "spotlightGames"
    | "searchGames" = `${gamesType.value}Games`;
  return storeToRefs(gameStore)[gamesGroup].value;
});

// Get more covers from Quasar Infinity Loader
async function getMoreCovers(
  index: number,
  done: (stop?: boolean | undefined) => void
): Promise<void> {
  if (lastFetchAmount.value < limit) return;
  await getCovers();
  done();
}

const showGames = computed(() => {
  return (
    games.value[currentConsole.value.name] &&
    games.value[currentConsole.value.name].length
  );
});

async function getCovers(): Promise<unknown[]> {
  if (!currentConsole.value.igdbId || retries.value > 3) return [];
  const currentOffset =
    pagination.value[currentConsole.value.name]?.[gamesType.value] || 0;
  try {
    loading.value = true;
    const query = `where game.platforms = [${currentConsole.value.igdbId}]`;
    const searchQuery = searchText.value
      ? ` & game.slug = *"${searchText.value}"*`
      : "";
    const result = await APIService.callIGDB(
      "covers",
      "*",
      `${query}${searchQuery}`,
      `limit ${limit}; offset ${currentOffset}`,
      `sort game.rating desc`
    );
    if (result.length) {
      retries.value = 0;
      const newOffset: number = currentOffset + limit;
      appStore.setPaginationOffset(
        currentConsole.value.name,
        gamesType.value,
        newOffset
      );
      gameStore.setGamesCover(result, gamesType.value);
      lastFetchAmount.value = result.length;
      return result;
    }
  } catch (error) {
    console.error("Error fetching covers");
    retries.value += 1;
    return [];
  } finally {
    loading.value = false;
  }
  return [];
}
</script>

<template>
  <q-card ref="scrollTargetRef" :class="['games-card', currentConsole.name]">
    <q-infinite-scroll
      v-if="showGames"
      ref="infiniteScroll"
      class="games-session"
      :offset="500"
      :scroll-target="scrollTargetRef"
      @load="getMoreCovers"
    >
      <div
        v-for="game in games[currentConsole.name]"
        :key="game.id"
        class="game-cover"
      >
        <CoverImage :image-url="game.cover.url" />
      </div>
      <div class="break"></div>
      <template #loading>
        <div v-if="lastFetchAmount == limit" class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <div v-else-if="!loading">
      No games for you, try to pick a console or use the Search bar
    </div>
    <q-inner-loading :showing="loading" />
  </q-card>
</template>

<style lang="scss" scoped>
.games-card {
  max-width: 80%;
  height: calc(
    100vh - (var(--headerAndFooterHeight) + var(--searchBarHeight) + 50) * 1px
  );
  overflow: auto;
  padding: 10px;
}
.games-session {
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
