import { defineStore, storeToRefs } from "pinia";
import { Game, GamesGroup } from "../types";
import { useAppStatus } from "./useAppStatus";

export const useGameStore = defineStore("gameStore", {
  state: () => ({
    spotlightGames: {} as GamesGroup,
    searchGames: {} as GamesGroup,
    currentGame: {} as Game,
  }),
  actions: {
    setGamesCover(covers: Record<string, unknown>[], type: "spotlight" | "search") {
      const gamesGroup: "spotlightGames" | "searchGames" = `${type}Games`;
      const appStore = useAppStatus();
      const { currentConsole } = storeToRefs(appStore);
      const consoleName = currentConsole.value.name;
      covers.forEach((gameCover) => {
        const cover = {
          id: gameCover.id as number,
          url: (gameCover.url as string).replace(/t_thumb/, "t_cover_big_2x"),
        };
        const gameIndex: number = this[gamesGroup][consoleName] ? this[gamesGroup][consoleName].findIndex(
          (game) => gameCover.game === game.id
        ) : -1;
        if (gameIndex === -1) {
          if (!this[gamesGroup][consoleName]) this[gamesGroup][consoleName] = [];
          this[gamesGroup][consoleName].push({
            id: gameCover.game as number,
            cover,
          });
          return;
        }
        this[gamesGroup][consoleName][gameIndex].cover = cover;
      });
    },
  },
});
