<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import SearchBar from "../components/SearchBar.vue";
import GamesCoverDisplay from "../components/GamesCoverDisplay.vue";
import SingleGame from "../components/SingleGame.vue";
import { useAppStatus } from "../store/useAppStatus";

const toggleLeftDrawer = ref(false);
const appStore = useAppStatus();
const { currentConsole } = storeToRefs(appStore);
const { currentView } = storeToRefs(appStore);
const { searchText } = storeToRefs(appStore);

const currentComponent = computed(() => {
  return currentView.value === "singleGame" ? SingleGame : GamesCoverDisplay;
});
watch(searchText, (newValue) => {
  if (!newValue) return;
  appStore.setView("search");
});
</script>

<template>
  <q-layout view="hHh lpR fFf" class="app-layout">
    <q-header
      elevated
      :class="['text-white', 'header', currentConsole.name]"
      height-hint="98"
    >
      <q-toolbar class="text-white shadow-2 rounded-borders">
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer = !toggleLeftDrawer"
        />
        <q-space />
        <q-tabs shrink stretch>
          <q-tab
            label="Main"
            name="main"
            @click="appStore.setConsole('main')"
          />
          <q-tab
            label="Atari 2600"
            to="/atari2600"
            @click="appStore.setConsole('atari2600')"
          />
          <q-tab name="msx" label="MSX" @click="appStore.setConsole('msx')" />
          <q-tab
            name="amiga"
            label="Amiga"
            @click="appStore.setConsole('amiga')"
          />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="toggleLeftDrawer" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container
      class="main-container"
      align="center"
      @click="toggleLeftDrawer = false"
    >
      <!-- TODO: Move Search away for mobile version -->
      <q-card class="search-card">
        <q-card-section>
          <SearchBar />
        </q-card-section>
      </q-card>
      <div class="transition-container">
        <Transition name="move-cards">
          <component :is="currentComponent" />
        </Transition>
      </div>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-subtitle2">SIN Games Database</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style lang="scss" scoped>
.header {
  &.atari2600 {
    background: var(--atari2600);
  }
  &.msx {
    background: var(--msx);
  }
  &.amiga {
    background: var(--amiga);
  }
  &.main {
    background: var(--main);
  }
}

.search-card {
  margin: 15px;
  max-width: 600px;
  max-height: calc(var(--searchBarHeight) * 1px);
}
.main-container {
  min-height: calc(100vh - var(--headerAndFooterHeight) * 1px);
  padding-top: 5px !important;
}
.app-layout {
  max-height: calc(var(--searchBarHeight) * 1px);
  min-height: unset !important;
}

.move-cards-leave-active,
.move-cards-enter-active {
  transition: all 0.3s ease;
}
.move-cards-enter-from {
  opacity: 0;
  transform: translate(130%, 0);
}
.move-cards-enter-to {
  opacity: 1;
  transform: translate(0%, 0);
}
.move-cards-leave-to {
  opacity: 0;
  transform: translate(-130%, 0);
}
.transition-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
