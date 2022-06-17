<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useAppStatus } from "../store/useAppStatus";

const appStore = useAppStatus();
const { currentConsole } = storeToRefs(appStore);
const searchText = ref("");
</script>

<template>
  <q-input
    v-model="searchText"
    :color="currentConsole.mainColor"
    outlined
    label="Search"
  >
    <template #append>
      <q-icon
        v-if="searchText !== ''"
        name="close"
        class="cursor-pointer"
        @click="searchText = ''"
      />
      <q-icon name="search" :color="currentConsole.mainColor" />
    </template>
  </q-input>
</template>

<style lang="scss" scoped></style>
