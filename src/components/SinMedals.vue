<script setup lang="ts">
import { MedalType } from "../types";

const props = defineProps<{
  medals: MedalType[];
}>();

const tooltips: Record<MedalType, string> = {
  "sin-trophy": "awesomeness",
  nonsense: "wtf",
  race: "race",
  random: "random madness",
  endless: "endless",
  frenetic: "frenetic",
  boring: "yawwwnm",
  underground: "underground",
  impossible: "impossible",
  cheat: "cheat mode",
};
</script>

<template>
  <q-card class="sin-medals">
    <q-img
      v-for="(medal, index) in props.medals"
      :key="index"
      :src="`/assets/${medal}.png`"
      class="medal"
      fit="fill"
    >
      <q-tooltip
        anchor="center middle"
        self="center middle"
        class="bg-black"
        transition-show="scale"
        transition-hide="scale"
        >{{ tooltips[medal] }}</q-tooltip
      >
    </q-img>
  </q-card>
</template>

<style lang="scss" scoped>
.sin-medals {
  height: 80px;
  .medal {
    height: 70px;
    max-width: 70px;
    margin: 5px;
  }
}
</style>
