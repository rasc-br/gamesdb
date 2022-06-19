import { defineStore, storeToRefs } from "pinia";
import { Game } from "../types";
import { useAppStatus } from "./useAppStatus";

export const useGameStore = defineStore("gameStore", {
  state: () => ({
    spotlightGames: {
      atari2600: [] as Game[],
      msx: [] as Game[],
      amiga: [] as Game[],
      main: [] as Game[],
    }
  }),
  actions: {
    setSpotlightGamesCover(covers: Record<string, unknown>[]) {
      const appStore = useAppStatus();
      const { currentConsole } = storeToRefs(appStore);
      const consolename = currentConsole.value.name;
      covers.forEach((gameCover) => {
        const gameIndex: number = this.spotlightGames[consolename].findIndex(
          (game) => gameCover.game === game.id
        );
        const cover = {
          id: gameCover.id as number,
          url: (gameCover.url as string).replace(/t_thumb/, "t_cover_big_2x"),
        };
        if (gameIndex === -1) {
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
