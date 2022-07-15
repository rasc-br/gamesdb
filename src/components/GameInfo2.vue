<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useAppStatus } from "../store/useAppStatus";
import { useGameStore } from "../store/useGameStore";
import { useUserStore } from "../store/useUserStore";

const gameStore = useGameStore();
const appStore = useAppStatus();
const { currentGame } = storeToRefs(gameStore);
const { currentConsole } = storeToRefs(appStore);
const slidePosition = ref(0);
const showBigImages = ref(false);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
  <div>
    <q-card-section class="video-content">
      <q-card class="video-card">
        There will be a video Oh yea, there will be
      </q-card>
    </q-card-section>
  </div>
</template>

<style lang="scss" scoped>
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
