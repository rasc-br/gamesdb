<script setup lang="ts">
import { computed, Ref, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAppStatus } from "../store/useAppStatus";
import CoverImage from "./CoverImage.vue";
import APIService from "../helpers/apiService";
import { useGameStore } from "../store/useGameStore";
import { GamesGroup } from "../types";

const props = defineProps<{
  type: "spotlight" | "search";
}>();

const appStore = useAppStatus();
const gameStore = useGameStore();
const { currentConsole } = storeToRefs(appStore);
const { pagination } = storeToRefs(appStore);
const { searchText } = storeToRefs(appStore);
const limit = 20;
const scrollTargetRef = ref<HTMLElement>();
const retries = ref(0);
const loading = ref(false);

const games: Ref<GamesGroup> = computed(() => {
  const gamesGroup: "spotlightGames" | "searchGames" = `${props.type}Games`;
  return storeToRefs(gameStore)[gamesGroup].value;
});

async function getMoreCovers(
  index: number,
  done: (stop?: boolean | undefined) => void
): Promise<void> {
  const result = await getCovers();
  result.length ? done() : done(true);
}

async function getCovers(): Promise<unknown[]> {
  if (!currentConsole.value.igdbId || retries.value > 3) return [];
  const currentOffset =
    pagination.value[currentConsole.value.name]?.[props.type] || 0;
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
      `sort rating desc`
    );
    if (result.length) {
      retries.value = 0;
      const newOffset: number = currentOffset + limit;
      appStore.setPaginationOffset(
        currentConsole.value.name,
        props.type,
        newOffset
      );
      gameStore.setGamesCover(result, props.type);
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
watch([currentConsole, props], () => {
  if (!games.value[currentConsole.value.name]) {
    retries.value = 0;
    getCovers();
  }
});
</script>

<template>
  <q-card ref="scrollTargetRef" :class="['games-card', currentConsole.name]">
    <q-infinite-scroll
      v-if="games[currentConsole.name] && games[currentConsole.name].length"
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
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <div v-else>
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
