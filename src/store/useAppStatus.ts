import { defineStore } from "pinia";

export const useAppStatus = defineStore("appStatus", {
  state: () => ({
    darkmode: true,
  }),
  actions: {
    toggleDarkMode(flag: boolean) {
      this.darkmode = flag;
    },
  },
});
