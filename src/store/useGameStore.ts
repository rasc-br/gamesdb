import { defineStore, storeToRefs } from "pinia";
import { Game, GamesGroup } from "../types";
import { useAppStatus } from "./useAppStatus";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useUserStore } from "./useUserStore";

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
    setCurrentGame(game: Game) {
      this.currentGame = game;
      this.prepareRatings();
    },
    async setGameInFirestore() {
      const appStore = useAppStatus();
      const { savingFirestore, currentConsole, firestore } =
        storeToRefs(appStore);

      savingFirestore.value = true;
      const id = this.currentGame.slug || this.currentGame.id.toString();
      try {
        await setDoc(
          doc(firestore.value, currentConsole.value.name, id),
          this.currentGame
        ),
          { merge: true };
        this.currentGame.fromFirebase = true;
      } catch (error) {
        console.error(error);
      } finally {
        savingFirestore.value = false;
      }
    },
    prepareRatings() {
      if (!this.currentGame.total_rating_count) {
        this.currentGame.total_rating_count = 2;
        this.currentGame.total_rating = 50;
        this.currentGame.upvotes = ["sin_start"];
        this.currentGame.downvotes = ["sin_start"];
      }
      if (!this.currentGame.upvotes) {
        const rating = this.currentGame.total_rating || 50;
        const votes = this.currentGame.total_rating_count || 2;
        const upvotes = (rating * votes) / 100;
        const downvotes = votes - upvotes;
        this.currentGame.upvotes = [];
        this.currentGame.downvotes = [];
        for (let index = 0; index <= upvotes; index += 1) {
          this.currentGame.upvotes.push(`sin_start${index}`);
        }
        for (let index = 0; index <= downvotes; index += 1) {
          this.currentGame.downvotes.push(`sin_start${index}`);
        }
      }
    },
    updateRating(
      vote: "upvotes" | "downvotes",
      votedBefore: "upvotes" | "downvotes" | ""
    ) {
      const userStore = useUserStore();
      const { user } = storeToRefs(userStore);

      if (votedBefore) {
        const index =
          this.currentGame[votedBefore]?.findIndex((name) => {
            return name === user.value.login;
          }) || 0;
        this.currentGame[votedBefore]?.splice(index, 1);
      }

      this.currentGame[vote]?.push(user.value.login);
      const votes =
        (this.currentGame.total_rating_count || 2) + (votedBefore ? 0 : 1);
      this.currentGame.total_rating_count = votes;
      const upvotes = (this.currentGame.upvotes || ["sin_start"]).length;
      this.currentGame.total_rating = (upvotes * 100) / votes;

      const appStore = useAppStatus();
      const { firestore, currentConsole } = storeToRefs(appStore);
      const id = this.currentGame.slug || this.currentGame.id.toString();
      const docRef = doc(firestore.value, currentConsole.value.name, id);
      updateDoc(docRef, {
        upvotes: this.currentGame.upvotes,
        downvotes: this.currentGame.downvotes,
        total_rating: this.currentGame.total_rating,
        total_rating_count: this.currentGame.total_rating_count,
      });
    },
  },
});
