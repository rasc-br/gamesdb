import { useUserStore } from "../store/useUserStore";
import { storeToRefs } from "pinia";
import { UserToken } from "../types";
import { ToRefs } from "vue";
import apicalypse from "apicalypse";

async function callIGDB(
  endpoint: string,
  fields: string,
  limit: number,
  query = "",
  order = "asc",
  sortBy = ""
): Promise<unknown> {
  const userStore = useUserStore();
  const { token }: ToRefs<{ token: UserToken }> = storeToRefs(userStore);
  const clientId: string = import.meta.env.VITE_TWITCH_CLIENTID;
  const headers = {
    "Client-ID": clientId,
    Authorization: `Bearer ${token.value.access_token}`,
  };

  const result = await apicalypse({
    method: "post",
    baseURL: import.meta.env.VITE_IGDB_BASE_URL,
    headers,
    responseType: "json",
  })
    .fields(fields)
    .limit(limit)
    .request(endpoint);

  console.log(result);
  return result;
}

export default {
  callIGDB,
};
