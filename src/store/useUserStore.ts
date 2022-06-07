import { defineStore } from "pinia";
import { UserToken } from "../types";
import axios from "axios";
import { Notify } from "quasar";
import { useAppStatus } from "./useAppStatus";

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
      const appStore = useAppStatus();
      const nowInSeconds = new Date().getTime() / 1000;
      if (nowInSeconds <= this.token.expires_at) {
        Notify.create({
          type: "warning",
          message: "Token is still valid, there is no reason to refresh",
        });
        return;
      }
      appStore.toogleLoading(true);
      this.token = this.getTokenFromLocal() || (await this.getTokenFromAPI());
      appStore.toogleLoading(false);
    },
    getTokenFromLocal(): UserToken | null {
      const nowInSeconds = new Date().getTime() / 1000;
      const localToken = localStorage.getItem("token");
      if (!localToken) return null;
      const token = JSON.parse(localToken);
      if (nowInSeconds > (token.expires_at || 0)) return null;
      return token;
    },
    async getTokenFromAPI(): Promise<UserToken> {
      const queryParameters = `client_id=${
        import.meta.env.VITE_TWITCH_CLIENTID
      }&client_secret=${
        import.meta.env.VITE_TWITCH_SECRET
      }&&grant_type=client_credentials`;
      try {
        const nowInSeconds = new Date().getTime() / 1000;
        const result = await axios.post(
          `${import.meta.env.VITE_TWITCH_AUTH_URL}?${queryParameters}`
        );
        if (!result.data?.expires_in) throw new Error("No expiration date");
        result.data.expires_at = nowInSeconds + this.token.expires_in;
        localStorage.setItem("token", JSON.stringify(result.data));
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
  },
});
