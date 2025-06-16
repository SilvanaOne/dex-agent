import { fetchSuiObject } from "./fetch.js";

export interface DexConfig {
  admin: string;
  dex_package: string;
  dex_object: string;
  circuit_blob_id: string;
  mina_network: string;
  mina_chain: string;
  mina_contract: string;
}

let dexConfig: DexConfig | undefined;
let timeFetched: number = 0;
const FETCH_INTERVAL = 1000 * 60 * 10; // 10 minutes

export async function getConfig(configID?: string): Promise<DexConfig> {
  if (dexConfig && timeFetched > Date.now() - FETCH_INTERVAL) return dexConfig;
  if (!configID) {
    //configID = process.env.NEXT_PUBLIC_CONFIG_ID ?? process.env.CONFIG_ID;
    const config = await fetch("https://dex.silvana.dev/api/v1/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "0.1.0",
      }),
    });
    if (!config.ok) {
      console.error("Cannot get config", config.status, config.statusText);
    } else {
      const configData = await config.json();
      configID = configData?.configId;
    }
  }
  if (!configID) {
    throw new Error("CONFIG_ID is not set");
  }
  const fetchResult = await fetchSuiObject(configID);
  dexConfig = (fetchResult.data?.content as any)
    ?.fields as unknown as DexConfig;

  if (!dexConfig) {
    throw new Error("Config object not found");
  }
  timeFetched = Date.now();
  return dexConfig;
}
