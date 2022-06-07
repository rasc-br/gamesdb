import { Firestore } from "firebase/firestore";
import { defineStore } from "pinia";

export const useAppStatus = defineStore("appStatus", {
  state: () => ({
    firestore: {} as Firestore,
  }),
  actions: {
    setFirestore(firestore: Firestore) {
      this.firestore = firestore;
    },
  },
});
