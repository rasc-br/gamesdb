import { defineStore } from "pinia";
import { Game } from "../types";

export const useGameStore = defineStore("gameStore", {
  state: () => ({
    spotlightGames: [] as Game[],
  }),
  actions: {
    setSpotlightGamesCover(covers: Record<string, unknown>[]) {
      covers.forEach((gameCover) => {
        const gameIndex: number = this.spotlightGames.findIndex(
          (game) => gameCover.game === game.id
        );
        const cover = {
          id: gameCover.image_id as number,
          url: (gameCover.url as string).replace(/t_thumb/, "t_cover_big_2x"),
        };
        if (gameIndex === -1) {
          this.spotlightGames.push({
            id: gameCover.game as number,
            cover,
          });
          return;
        }
        this.spotlightGames[gameIndex].cover = cover;
      });
    },
  },
});
