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
    configID = process.env.NEXT_PUBLIC_CONFIG_ID ?? process.env.CONFIG_ID;
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
