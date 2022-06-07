import { defineStore, storeToRefs } from "pinia";
import { UserToken } from "../types";
import axios from "axios";
import { Notify } from "quasar";
import { doc, setDoc, Firestore, getDoc } from "firebase/firestore";
import { useAppStatus } from "./useAppStatus";
import { ToRefs } from "vue";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    token: {
      access_token: "",
      expires_in: 0,
      token_type: "bearer",
      expires_at: 0,
    } as UserToken,
    user: {
      login: "candello",
    },
  }),
  actions: {
    async refreshToken(): Promise<void> {
      const nowInSeconds = new Date().getTime() / 1000;
      if (nowInSeconds <= this.token.expires_at) {
        Notify.create({
          type: "warning",
          message: "Token is still valid, there is no reason to refresh",
        });
        return;
      }
      this.token =
        (await this.getTokenFromFirestore()) || (await this.getTokenFromAPI());
      if (!this.token.expires_in) return;
      this.token.expires_at = nowInSeconds + this.token.expires_in;
    },
    async getTokenFromAPI(): Promise<UserToken> {
      const queryParameters = `client_id=${
        import.meta.env.VITE_TWITCH_CLIENTID
      }&client_secret=${
        import.meta.env.VITE_TWITCH_SECRET
      }&&grant_type=client_credentials`;
      try {
        const result = await axios.post(
          `${import.meta.env.VITE_TWITCH_AUTH_URL}?${queryParameters}`
        );
        if (!result.data?.expires_in) throw new Error("No expiration date");
        this.setTokenInFirestore(result.data);
        return result.data as UserToken;
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Error fetching credentials",
        });
        console.error(error);
        return {} as UserToken;
      }
    },
    async getTokenFromFirestore(): Promise<UserToken | null> {
      const appStore = useAppStatus();
      const { firestore }: ToRefs<{ firestore: Firestore }> =
        storeToRefs(appStore);
      const nowInSeconds = new Date().getTime() / 1000;
      const userRef = await getDoc(
        doc(firestore.value, "user", this.user.login)
      );
      const user = userRef.data() || {};
      if (!userRef.exists() || nowInSeconds > (user.token?.expires_at || 0))
        return null;
      return userRef.data().token as UserToken;
    },
    setTokenInFirestore(token: UserToken): void {
      const appStore = useAppStatus();
      const { firestore }: ToRefs<{ firestore: Firestore }> =
        storeToRefs(appStore);
      setDoc(doc(firestore.value, "user", this.user.login), token, {
        merge: true,
      });
    },
  },
});
