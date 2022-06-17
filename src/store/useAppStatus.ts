import { Firestore } from "firebase/firestore";
import { defineStore } from "pinia";
import { ConsoleInfo } from "../types";

function getConsoleValues(console: string): ConsoleInfo {
  switch (console) {
    case "atari2600":
      return { name: "atari2600", mainColor: "yellow-8", igdbId: 59 };
    case "msx":
      return { name: "msx", mainColor: "blue-14", igdbId: 27 };
    case "amiga":
      return { name: "amiga", mainColor: "red-8", igdbId: 16 };
    default:
      return { name: "main", mainColor: "grey-6", igdbId: 0 };
  }
}

export const useAppStatus = defineStore("appStatus", {
  state: () => ({
    firestore: {} as Firestore,
    loading: false,
    currentConsole: {
      name: "main",
      mainColor: "grey-6",
      igdbId: 0,
    },
  }),
  actions: {
    setFirestore(firestore: Firestore) {
      this.firestore = firestore;
    },
    toogleLoading(flag: boolean) {
      this.loading = flag;
    },
    setConsole(console: string) {
      this.currentConsole = getConsoleValues(console);
    },
  },
});
