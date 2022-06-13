import axios from "axios";
import { useUserStore } from "../store/useUserStore";
import { storeToRefs } from "pinia";
import { UserToken } from "../types";
import { ToRefs } from "vue";

// Ver o retorno dessa budega para receber direito na dashboard
async function callIGDB(
  endpoint: string,
  fields: string
): Promise<Record<string, unknown>> {
  const userStore = useUserStore();
  const { token }: ToRefs<{ token: UserToken }> = storeToRefs(userStore);
  const freeCorsProxy =
    import.meta.env.MODE === "development"
      ? "https://cors-anywhere.herokuapp.com/"
      : "";
  const url = `${freeCorsProxy}${
    import.meta.env.VITE_IGDB_BASE_URL
  }/${endpoint}`;
  const clientId: string = import.meta.env.VITE_TWITCH_CLIENTID;
  const headers = {
    "Content-Type": "text/plain",
    "Client-ID": clientId,
    Authorization: `Bearer ${token.value.access_token}`,
  };
  const body = `fields ${fields};`;
  try {
    const result = await axios({
      url,
      method: "POST",
      headers,
      data: body,
    });
    return result.data || {};
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default {
  callIGDB,
};
