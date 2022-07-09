import { defineStore, storeToRefs } from "pinia";
import { Game, GamesGroup } from "../types";
import { useAppStatus } from "./useAppStatus";
import { doc, setDoc } from "firebase/firestore";

export const useGameStore = defineStore("gameStore", {
  state: () => ({
    spotlightGames: {} as GamesGroup,
    searchGames: {} as GamesGroup,
    currentGame: {} as Game,
  }),
  actions: {
    setGamesCover(
      covers: Record<string, unknown>[],
      type: "spotlight" | "search"
    ) {
      const gamesGroup: "spotlightGames" | "searchGames" = `${type}Games`;
      const appStore = useAppStatus();
      const { currentConsole } = storeToRefs(appStore);
      const consoleName = currentConsole.value.name;
      covers.forEach((gameCover) => {
        const cover = {
          id: gameCover.id as number,
          url: (gameCover.url as string).replace(/t_thumb/, "t_cover_big_2x"),
        };
        const gameIndex: number = this[gamesGroup][consoleName]
          ? this[gamesGroup][consoleName].findIndex(
              (game) => gameCover.game === game.id
            )
          : -1;
        if (gameIndex === -1) {
          if (!this[gamesGroup][consoleName])
            this[gamesGroup][consoleName] = [];
          this[gamesGroup][consoleName].push({
            id: (gameCover.game as Record<string, unknown>).id as number,
            slug: (gameCover.game as Record<string, unknown>).slug as string,
            cover,
          });
        } else {
          this[gamesGroup][consoleName][gameIndex].cover = cover;
        }
      });
      // Merge spotlightGames and searchGames into allGames to reduce API calls?
    },
    async setGameInFirestore() {
      const appStore = useAppStatus();
      const { savingFirestore } = storeToRefs(appStore);
      const { firestore } = storeToRefs(appStore);
      const { currentConsole } = storeToRefs(appStore);

      savingFirestore.value = true;
      const id = this.currentGame.slug || this.currentGame.id.toString();
      try {
        await setDoc(
          doc(firestore.value, currentConsole.value.name, id),
          this.currentGame
        ),
          { merge: true };
      } catch (error) {
        console.error(error);
      } finally {
        savingFirestore.value = false;
      }
    },
  },
});
