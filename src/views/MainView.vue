<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const toggleLeftDrawer = ref(false);

const route = useRoute();
const menuClass = computed(() => {
  return route.path.slice(1) || "main";
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated :class="['text-white', menuClass]" height-hint="98">
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
          <q-route-tab to="/atari2600" label="Atari 2600" />
          <q-route-tab to="/msx" label="MSX" />
          <q-route-tab to="/amiga" label="Amiga" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="toggleLeftDrawer" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container
      style="min-height: inherit"
      @click="toggleLeftDrawer = false"
    >
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>SIN Games Database</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style scoped>
.atari2600 {
  background: linear-gradient(
    186deg,
    rgba(83, 55, 2, 1) 0%,
    rgba(121, 93, 9, 1) 9%,
    rgba(226, 197, 2, 1) 100%
  );
}
.msx {
  background: linear-gradient(
    186deg,
    rgba(2, 16, 83, 1) 0%,
    rgba(10, 28, 139, 1) 9%,
    rgba(0, 39, 255, 1) 100%
  );
}
.amiga {
  background: linear-gradient(
    186deg,
    rgba(83, 2, 40, 1) 0%,
    rgba(139, 10, 65, 1) 9%,
    rgba(255, 0, 0, 1) 100%
  );
}
.main {
  background: linear-gradient(
    186deg,
    rgba(69, 68, 68, 1) 0%,
    rgba(143, 139, 141, 1) 9%,
    rgba(250, 250, 250, 1) 100%
  );
}
</style>
