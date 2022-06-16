<script setup lang="ts">
import CoverImage from "./CoverImage.vue";
</script>

<template>
  <q-card class="spotlight-card">
    <q-card-section class="spotlight-session">
      <div v-for="index in 16" :key="index" class="game-cover">
        <CoverImage
          image-url="https://images.unsplash.com/photo-1655212941945-4c6415a4dae3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.spotlight-card {
  max-width: 80%;
  height: calc(
    100vh - (var(--headerAndFooterHeight) + var(--searchBarHeight) + 50) * 1px
  );
}
.spotlight-session {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.game-cover {
  margin-bottom: 20px;
}
</style>
