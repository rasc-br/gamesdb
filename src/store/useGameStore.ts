import { defineStore, storeToRefs } from "pinia";
import { GamesGroup } from "../types";
import { useAppStatus } from "./useAppStatus";

export const useGameStore = defineStore("gameStore", {
  state: () => ({
    spotlightGames: {} as GamesGroup,
  }),
  actions: {
    setSpotlightGamesCover(covers: Record<string, unknown>[]) {
      const appStore = useAppStatus();
      const { currentConsole } = storeToRefs(appStore);
      const consolename = currentConsole.value.name;
      covers.forEach((gameCover) => {
        const cover = {
          id: gameCover.id as number,
          url: (gameCover.url as string).replace(/t_thumb/, "t_cover_big_2x"),
        };
        const gameIndex: number = this.spotlightGames[consolename] ? this.spotlightGames[consolename].findIndex(
          (game) => gameCover.game === game.id
        ) : -1;
        if (gameIndex === -1) {
          if (!this.spotlightGames[consolename]) this.spotlightGames[consolename] = [];
          this.spotlightGames[consolename].push({
            id: gameCover.game as number,
            cover,
          });
          return;
        }
        this.spotlightGames[consolename][gameIndex].cover = cover;
      });
    },
  },
});
