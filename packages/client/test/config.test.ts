import { describe, it } from "node:test";
import assert from "node:assert";
import { getConfig, DexConfig, getKey } from "@dex-agent/lib";
import { createConfig, updateConfig } from "../src/config.js";

const readOnly = false;

const adminSecretKey: string = process.env.ADMIN_SECRET_KEY!;
if (!adminSecretKey) {
  throw new Error("ADMIN_SECRET_KEY is not set");
}

const { address, keypair } = await getKey({
  secretKey: adminSecretKey,
  name: "admin",
  minBalance: 1,
  topupAmount: 5,
});

const config: DexConfig = {
  admin: address,
  dex_package: process.env.PACKAGE_ID || "",
  dex_object: process.env.DEX_ID || "",
  circuit_blob_id: process.env.CIRCUIT_BLOB_ID || "",
  mina_network: process.env.MINA_NETWORK || "mina",
  mina_chain: process.env.MINA_CHAIN || "local",
  mina_contract: process.env.MINA_CONTRACT || "",
};

describe("Config", async () => {
  it.skip("should create config", { skip: readOnly }, async () => {
    const { configPackageID, configID, adminID } = await createConfig(config);
    console.log({ configPackageID, configID, adminID });
    assert.ok(!!configPackageID);
    assert.ok(!!configID);
    assert.ok(!!adminID);
  });

  it("should get config", async () => {
    const config = await getConfig();
    console.log("current config:", config);
  });

  it.skip("should update config", { skip: readOnly }, async () => {
    await updateConfig({
      mina_chain: process.env.MINA_CHAIN || "",
      dex_package: process.env.PACKAGE_ID || "",
    });
  });

  it.skip("should get config after update", { skip: readOnly }, async () => {
    const config = await getConfig();
    console.log("updated config:", config);
    assert.ok(config !== undefined);
  });
});
