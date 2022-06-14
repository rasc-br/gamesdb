import { Firestore } from "firebase/firestore";
import { defineStore } from "pinia";

function switchColor(console: string): string {
  switch (console) {
    case "atari2600":
      return "yellow-8";
    case "msx":
      return "blue-14";
    case "amiga":
      return "red-8";
    default:
      return "grey-6";
  }
}

export const useAppStatus = defineStore("appStatus", {
  state: () => ({
    firestore: {} as Firestore,
    loading: false,
    currentConsole: "main",
    mainColor: "grey-6",
  }),
  actions: {
    setFirestore(firestore: Firestore) {
      this.firestore = firestore;
    },
    toogleLoading(flag: boolean) {
      this.loading = flag;
    },
    setConsole(console: string) {
      this.currentConsole = console;
      this.mainColor = switchColor(console);
    },
  },
});
