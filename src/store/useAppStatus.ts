import { Firestore } from "firebase/firestore";
import { defineStore } from "pinia";

export const useAppStatus = defineStore("appStatus", {
  state: () => ({
    firestore: {} as Firestore,
    loading: false,
  }),
  actions: {
    setFirestore(firestore: Firestore) {
      this.firestore = firestore;
    },
    toogleLoading(flag: boolean) {
      this.loading = flag;
    },
  },
});
