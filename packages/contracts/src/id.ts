import { getConfig } from "@dex-agent/lib";

export async function getIDs() {
  const config = await getConfig();
  if (!config.dex_package || !config.dex_object) {
    throw new Error("DEX_PACKAGE or DEX_OBJECT is not set");
  }
  return {
    packageID: config.dex_package,
    dexID: config.dex_object,
  };
}
