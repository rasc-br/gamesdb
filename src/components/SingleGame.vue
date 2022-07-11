<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useAppStatus } from "../store/useAppStatus";
import { useGameStore } from "../store/useGameStore";
import SinMedals from "../components/SinMedals.vue";
import { useUserStore } from "../store/useUserStore";

const gameStore = useGameStore();
const appStore = useAppStatus();
const { currentGame } = storeToRefs(gameStore);
const { currentConsole } = storeToRefs(appStore);
const slidePosition = ref(0);
const showBigImages = ref(false);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const gameImageUrls = computed(() => {
  const imageUrls = [];
  imageUrls.push(currentGame.value.cover?.url);
  if (currentGame.value.screenshots) {
    currentGame.value.screenshots.forEach((screenshot) => {
      imageUrls.push(
        (screenshot.url as string).replace(/t_thumb/, "t_cover_big_2x")
      );
    });
  }
  return imageUrls;
});

const voted = computed(() => {
  if (currentGame.value.upvotes?.includes(user.value.login)) {
    return "upvotes";
  }
  if (currentGame.value.downvotes?.includes(user.value.login)) {
    return "downvotes";
  }
  return "";
});

const igdbRating = computed(() => {
  return Math.ceil(currentGame.value.total_rating || 0);
});
</script>

<template>
  <q-card ref="singleGameCard" class="game-card">
    <q-card-section class="title">
      <div class="text-h6">{{ currentGame.name }}</div>
    </q-card-section>
    <q-card-section class="summary-content">
      <q-card class="images-card">
        <q-carousel
          v-model="slidePosition"
          swipeable
          animated
          arrows
          navigation
          infinite
          :control-color="currentConsole.mainColor"
        >
          <q-carousel-slide
            v-for="(imageUrl, index) in gameImageUrls"
            :key="index"
            :name="index"
            :img-src="imageUrl"
            class="carrosel-images"
            @click="showBigImages = true"
          />
        </q-carousel>
      </q-card>
      <div class="right-side">
        <q-card :class="['text-card', currentConsole.name]">
          <div v-if="currentGame.storyline">
            <div class="text-subtitle2">Story</div>
            <p class="text-caption">{{ currentGame.storyline }}</p>
          </div>
          <div v-if="currentGame.summary">
            <div class="text-subtitle2">Summary</div>
            <p class="text-caption">{{ currentGame.summary }}</p>
          </div>
          <div v-if="!currentGame.summary && !currentGame.storyline">
            <div class="text-subtitle2">No information</div>
          </div>
        </q-card>
        <q-card class="igdb-rating">
          <div class="q-pa-md">
            <q-linear-progress
              size="25px"
              rounded
              :value="igdbRating / 100"
              :color="currentConsole.mainColor"
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  color="white"
                  :text-color="currentConsole.mainColor"
                  :label="`${igdbRating} %`"
                />
              </div>
            </q-linear-progress>
            <div class="icons-container">
              <q-icon
                name="fa-solid fa-thumbs-down"
                :color="currentConsole.mainColor"
                :class="['icons', voted === 'downvotes' ? 'voted' : '']"
                @click="
                  voted !== 'downvotes'
                    ? gameStore.updateRating('downvotes', voted)
                    : null
                "
              />
              <q-icon
                name="fa-solid fa-thumbs-up"
                :color="currentConsole.mainColor"
                :class="['icons', voted === 'upvotes' ? 'voted' : '']"
                @click="
                  voted !== 'upvotes'
                    ? gameStore.updateRating('upvotes', voted)
                    : null
                "
              />
            </div>
          </div>
        </q-card>
      </div>
    </q-card-section>
    <q-card-section v-if="currentGame.medals">
      <SinMedals :medals="currentGame.medals" />
    </q-card-section>

    <q-dialog v-model="showBigImages" persistent :maximized="true">
      <q-card class="dialog-card">
        <q-bar>
          <q-space />
          <q-btn v-close-popup dense flat icon="close">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section style="height: 100%">
          <q-carousel
            v-model="slidePosition"
            style="height: 90%"
            swipeable
            animated
            arrows
            navigation
            infinite
            :control-color="currentConsole.mainColor"
          >
            <q-carousel-slide
              v-for="(imageUrl, index) in gameImageUrls"
              :key="index"
              :name="index"
              :img-src="imageUrl"
              class="carrosel-images"
            />
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
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
.text-card {
  padding: 10px;
  text-align: justify;
  overflow: auto;
  height: calc(var(--mainCardHeight) / 2);
}
.summary-content {
  display: flex;
  justify-content: space-between;
}
.images-card {
  width: 58%;
}
.dialog-card {
  margin: 20px;
  height: 90%;
}
.carrosel-images {
  background-size: contain;
  background-repeat: no-repeat;
}
.title {
  padding: 0px;
}

.right-side {
  width: 40%;
}
.igdb-rating {
  height: calc(var(--mainCardHeight) / 6.3);
  margin-top: 10px;
}
.icons {
  font-size: 30px;
  cursor: pointer;
  &.voted {
    filter: brightness(150%) invert(75%);
  }
}
.icons-container {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
}
</style>
