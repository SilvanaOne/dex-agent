import { NetworkInfoData } from "./types.js";
import { fetchDex } from "./fetch.js";
import { getConfig } from "./config.js";
import { daProvider } from "./da-hub.js";

export async function getNetworkInfo(): Promise<NetworkInfoData | undefined> {
  const config = await getConfig();
  console.log("config", config);
  const dex = await fetchDex();
  if (!dex) {
    return undefined;
  }
  console.log("dex", dex);
  const info: NetworkInfoData = {
    l1Settlement: "Mina Protocol",
    minaChainId: config.mina_chain,
    minaContractAddress: config.mina_contract,
    minaCircuitDAHash: config.circuit_blob_id,
    zkCoordination: "Sui",
    suiAddress: config.dex_object,
    dataAvailability: daProvider,
    wallet: "Auro",
    lastBlockNumber: Number(dex.block_number),
    lastProvedBlockNumber: Number(dex.last_proved_block_number),
    sequence: Number(dex.sequence),
    circuitCreatedAt: dex?.circuit?.fields?.created_at,
    circuitDescription: dex?.circuit?.fields?.description,
    circuitId: dex?.circuit?.fields?.id?.id,
    circuitName: dex?.circuit?.fields?.name,
    circuitPackageDaHash: dex?.circuit?.fields?.package_da_hash,
    circuitVerificationKeyData: dex?.circuit?.fields?.verification_key_data,
    circuitVerificationKeyHash: dex?.circuit?.fields?.verification_key_hash,
  };
  console.log("info", info);
  return info;
}
