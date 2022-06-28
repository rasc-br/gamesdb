import { Firestore } from "firebase/firestore";
import { defineStore } from "pinia";
import { ConsoleInfo, ConsoleName, CurrentView, OffsetType, Pagination } from "../types";

function getConsoleValues(console: ConsoleName): ConsoleInfo {
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
    } as ConsoleInfo,
    pagination: {} as Pagination,
    searchText: "",
    currentView: 'search' as CurrentView,
  }),
  actions: {
    setFirestore(firestore: Firestore) {
      this.firestore = firestore;
    },
    toogleLoading(flag: boolean) {
      this.loading = flag;
    },
    setConsole(console: ConsoleName) {
      this.currentConsole = getConsoleValues(console);
      this.currentView = "search";
    },
    setPaginationOffset(console: ConsoleName, type: OffsetType, offset: number) {
      if (!this.pagination[console]) this.pagination = { ...this.pagination, ...{[console]: { [type]: 0}}}
      this.pagination[console][type] = offset;
    },
    setView(view: CurrentView) {
      this.currentView = view;
    }
  },
});
