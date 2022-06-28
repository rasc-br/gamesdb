<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useAppStatus } from "../store/useAppStatus";
import { useGameStore } from "../store/useGameStore";

const gameStore = useGameStore();
const appStore = useAppStatus();
const { currentGame } = storeToRefs(gameStore);
const { currentConsole } = storeToRefs(appStore);
const slidePosition = ref(0);
const showBigImages = ref(false);

const gameImageUrls = computed(() => {
  const imageUrls = [];
  imageUrls.push(currentGame.value.cover.url);
  if (currentGame.value.screenshots) {
    currentGame.value.screenshots.forEach((screenshot) => {
      imageUrls.push(
        (screenshot.url as string).replace(/t_thumb/, "t_cover_big_2x")
      );
    });
  }
  return imageUrls;
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
    </q-card-section>
    <q-card-section>
      <q-card class="sin-medals"> </q-card>
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
  width: 40%;
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
.sin-medals {
  height: 80px;
}
</style>
