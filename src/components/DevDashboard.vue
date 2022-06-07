<script setup lang="ts">
import { useUserStore } from "../store/useUserStore";
import { storeToRefs } from "pinia";
import { computed, ToRefs } from "vue";
import { UserToken } from "../types";
import { useAppStatus } from "../store/useAppStatus";

const userStore = useUserStore();
const { token }: ToRefs<{ token: UserToken }> = storeToRefs(userStore);
const expirationDate = computed(() =>
  new Date(token.value.expires_at * 1000).toLocaleString()
);
const appStore = useAppStatus();
const { loading }: ToRefs<{ loading: boolean }> = storeToRefs(appStore);
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title> Development Dashboard </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="dashboard-card">
        <q-card-section v-if="token.expires_in" class="bg-blue text-white">
          <div class="text-h6">Current Token</div>
          <div class="text-subtitle2">{{ token.access_token }}</div>
          <div class="text-subtitle2">
            Expires in: {{ token.expires_in }} seconds
          </div>
          <div class="text-subtitle2">
            Expiration Date: {{ expirationDate }}
          </div>
        </q-card-section>
        <q-card-section v-else class="bg-blue text-white">
          No token
        </q-card-section>
        <q-card-actions align="around">
          <q-btn
            outline
            style="color: #2196f3"
            :loading="loading"
            @click="userStore.refreshToken"
            >Refresh Token</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
  </q-layout>
</template>
<style lang="scss" scoped>
.dashboard-card {
  width: 100%;
  max-width: 300px;
}
</style>
