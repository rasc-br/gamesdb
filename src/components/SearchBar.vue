<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useAppStatus } from "../store/useAppStatus";

const appStore = useAppStatus();
const { mainColor } = storeToRefs(appStore);
const searchText = ref("");
</script>

<template>
  <q-input v-model="searchText" :color="mainColor" outlined label="Search">
    <template #append>
      <q-icon
        v-if="searchText !== ''"
        name="close"
        class="cursor-pointer"
        @click="searchText = ''"
      />
      <q-icon name="search" :color="mainColor" />
    </template>
  </q-input>
</template>

<style lang="scss" scoped></style>
