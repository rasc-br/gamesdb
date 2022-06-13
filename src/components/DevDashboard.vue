<script setup lang="ts">
import { useUserStore } from "../store/useUserStore";
import { storeToRefs } from "pinia";
import { computed, ref, ToRefs } from "vue";
import { UserToken } from "../types";
import { useAppStatus } from "../store/useAppStatus";
import APIService from "../helpers/apiService";

const userStore = useUserStore();
const { token }: ToRefs<{ token: UserToken }> = storeToRefs(userStore);
const expirationDate = computed(() =>
  new Date(token.value.expires_at * 1000).toLocaleString()
);
const appStore = useAppStatus();
const { loading }: ToRefs<{ loading: boolean }> = storeToRefs(appStore);

const endpoint = ref("");
const fields = ref("");
const apiResult = ref({});

async function callAPI() {
  apiResult.value = await APIService.callIGDB(endpoint.value, fields.value);
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title> Development Dashboard </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div class="q-pa-md row justify-center q-gutter-md">
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
            color="primary"
            :loading="loading"
            @click="userStore.refreshToken"
            >Refresh Token</q-btn
          >
        </q-card-actions>
      </q-card>

      <q-card class="dashboard-card">
        <q-card-section
          class="bg-deep-purple-3 text-black q-pa-sm q-gutter-y-sm"
        >
          <div class="text-h6">IGDB Endpoint Test</div>
          <q-input
            v-model="endpoint"
            color="black"
            outlined
            label="Endpoint"
            :dense="true"
          />
          <q-input
            v-model="fields"
            color="black"
            outlined
            label="Fields"
            :dense="true"
          />
        </q-card-section>

        <q-card-actions align="around">
          <q-btn
            outline
            color="deep-purple-3"
            :loading="loading"
            @click="callAPI"
            >Call endpoint</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
    <div class="q-pa-md row justify-center q-gutter-md">
      <q-card class="dashboard-card result">
        <q-card-section class="q-pa-sm q-gutter-y-sm result">
          <div v-if="Object.keys(apiResult).length">
            {{ apiResult }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-layout>
</template>
<style lang="scss" scoped>
.dashboard-card {
  width: 100%;
  max-width: 300px;
  &.result {
    height: 200px;
    overflow: auto;
    min-width: 500px;
  }
}
</style>
