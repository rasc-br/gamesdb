import { defineStore } from "pinia";
import { UserToken } from "../types";
import axios from "axios";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    token: {
      access_token: "",
      expires_in: 0,
      token_type: "bearer",
      expires_at: 0,
    } as UserToken,
  }),
  actions: {
    async refreshToken(): Promise<void> {
      const nowInSeconds = new Date().getTime() / 1000;
      if (nowInSeconds <= this.token.expires_at) return;
      const queryParameters = `client_id=${
        import.meta.env.VITE_TWITCH_CLIENTID
      }&client_secret=${
        import.meta.env.VITE_TWITCH_SECRET
      }&&grant_type=client_credentials`;
      try {
        const result = await axios.post(
          `${import.meta.env.VITE_TWITCH_AUTH_URL}?${queryParameters}`
        );
        if (result.data?.expires_in) {
          this.token = result.data as UserToken;
          this.token.expires_at = nowInSeconds + result.data.expires_in;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
