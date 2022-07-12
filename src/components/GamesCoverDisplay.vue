<script setup lang="ts">
import { computed, Ref, ref, watch, nextTick, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAppStatus } from "../store/useAppStatus";
import CoverImage from "./CoverImage.vue";
import APIService from "../helpers/apiService";
import { useGameStore } from "../store/useGameStore";
import { Game, GamesGroup } from "../types";
import { QInfiniteScroll } from "quasar";
import { getDoc, doc } from "firebase/firestore";

const appStore = useAppStatus();
const gameStore = useGameStore();
const { currentConsole } = storeToRefs(appStore);
const { pagination } = storeToRefs(appStore);
const { searchText } = storeToRefs(appStore);
const { searchGames } = storeToRefs(gameStore);
const { currentGame } = storeToRefs(gameStore);
const { firestore } = storeToRefs(appStore);
const limit = 20;
const scrollTargetRef = ref<HTMLElement>();
const infiniteScroll = ref<QInfiniteScroll>();
const retries = ref(0);
const loading = ref(false);
const lastFetchAmount = ref(0);
const gamesType: Ref<"spotlight" | "search"> = ref("spotlight");
const animateSelect = ref([] as boolean[]);

watch(searchText, (newValue, oldValue) => {
  if (newValue === oldValue) return;
  toogleModes(newValue);
});

watch(currentConsole, () => {
  if (games.value[currentConsole.value.name]) return;
  retries.value = 0;
  lastFetchAmount.value = limit;
  getCovers();
});

const games: Ref<GamesGroup> = computed(() => {
  const gamesGroup:
    | "spotlightGames"
    | "searchGames" = `${gamesType.value}Games`;
  return storeToRefs(gameStore)[gamesGroup].value;
});

function toogleModes(text: string) {
  lastFetchAmount.value = limit;
  searchGames.value = {} as GamesGroup;
  if (!text) {
    nextTick(() => (gamesType.value = text ? "search" : "spotlight"));
    if (!showGames.value) getCovers();
    return;
  }
  gamesType.value = text ? "search" : "spotlight";
  pagination.value[currentConsole.value.name].search = 0;
  getCovers();
}

async function getMoreCovers(
  index: number,
  done: (stop?: boolean | undefined) => void
): Promise<void> {
  if (lastFetchAmount.value < limit) return;
  await getCovers();
  done();
}

async function selectGame(game: Game) {
  animateSelect.value[game.id] = true;
  setTimeout(() => {
    animateSelect.value[game.id] = false;
  }, 200);
  gameStore.setCurrentGame(await getGame(game));
  appStore.setView("singleGame");
}

const showGames = computed(() => {
  return (
    games.value[currentConsole.value.name] &&
    games.value[currentConsole.value.name].length
  );
});

async function checkFirebase(gameSlug: string): Promise<Game> {
  const gameSnapshot = await getDoc(
    doc(firestore.value, currentConsole.value.name, gameSlug)
  );
  if (gameSnapshot.exists()) return gameSnapshot.data() as Game;
  return {} as Game;
}

async function getCovers(): Promise<unknown[]> {
  if (!currentConsole.value.igdbId || retries.value > 3) return [];
  if (!searchText.value) gamesType.value = "spotlight";
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
      "*, game.slug",
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

async function getGame(game: Game): Promise<Game> {
  if (game.id === currentGame.value.id) return currentGame.value;

  const fromFirebase = await checkFirebase(game.slug);
  if (Object.keys(fromFirebase).length) {
    fromFirebase.fromFirebase = true;
    return fromFirebase;
  }

  try {
    const result = await APIService.callIGDB(
      "games",
      "*, screenshots.*",
      `where id = ${game.id}`
    );
    if (!result.length) return {} as Game;
    result[0].cover = game.cover;
    return result[0] as unknown as Game;
  } catch (error) {
    console.error("Error fetching game");
    return {} as Game;
  }
}

onMounted(() => {
  gamesType.value = "search";
  toogleModes(searchText.value);
});
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
        <CoverImage
          :image-url="game.cover.url"
          :class="[{ animateSelect: animateSelect[game.id] }, 'coverImage']"
          @click="selectGame(game)"
        />
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
  width: 80%;
  height: calc(
    100vh - (var(--headerAndFooterHeight) + var(--searchBarHeight) + 50) * 1px
  );
  position: absolute;
  overflow: auto;
  padding: 10px;
}
.games-session {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.game-cover {
  margin: 0px 5px 20px 0;
}
.break {
  flex-basis: 100%;
  height: 0;
}
.coverImage {
  transition: all 0.15s;
}
.animateSelect {
  transform: scale(0.85);
}
</style>
