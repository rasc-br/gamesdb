import axios, { AxiosResponse } from "axios";
import { useUserStore } from "../store/useUserStore";
import { storeToRefs } from "pinia";
import { UserToken } from "../types";
import { ToRefs } from "vue";

async function callAPI(
  endpoint: string,
  fields: string
): Promise<AxiosResponse> {
  const userStore = useUserStore();
  const { token }: ToRefs<{ token: UserToken }> = storeToRefs(userStore);
  const url = `${import.meta.env.VITE_IGDB_BASE_URL}/${endpoint}`;
  const clientId: string = import.meta.env.VITE_TWITCH_CLIENTID;
  const headers = {
    "Content-Type": "text/plain",
    "Client-ID": clientId,
    Authorization: `Bearer ${token.value.access_token}`,
  };
  const body = `fields ${fields};`;
  // const agent = new https.Agent({
  //   rejectUnauthorized: false,
  // });
  // axios.get('https://something.com/foo', { httpsAgent: agent });
  // const result = await axios.post(url, body, { headers });
  //  httpsAgent: new https.Agent({ rejectUnauthorized: false }),

  const result = await axios({
    url,
    method: "POST",
    headers,
    data: body,
  });

  console.log(result);
  return result;
}

export default {
  callAPI,
};
