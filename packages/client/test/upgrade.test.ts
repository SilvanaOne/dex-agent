import { describe, it } from "node:test";
import assert from "node:assert";
import { getKey } from "@dex-agent/lib";
import { buildMovePackage } from "../src/build.js";
import { executeTx, waitTx } from "@dex-agent/lib";
import { DexObjects } from "./helpers/dex.js";
import { buildUpgradeTx } from "@dex-agent/lib";
import { readFile } from "node:fs/promises";

const adminAddress: string = process.env.ADMIN!;
const adminSecretKey: string = process.env.ADMIN_SECRET_KEY!;
const upgradeCap =
  "0xb02c5caab6fabd4f89875c92250bc16a8ad9eed763340aa64d295164d39e8bc7";
const oldPackageID = process.env.PACKAGE_ID;

if (!adminAddress || !adminSecretKey || !oldPackageID) {
  throw new Error("Missing environment variables");
}

let packageID: string | undefined = undefined;

describe("Upgrade DEX package", async () => {
  it("should upgrade SUI DEX package", async () => {
    const { address, keypair } = await getKey({
      secretKey: adminSecretKey,
      name: "admin",
      minBalance: 1,
      topupAmount: 5,
    });
    const { modules, dependencies, digest } = await buildMovePackage(
      "../coordination"
    );
    const { tx } = await buildUpgradeTx({
      modules,
      dependencies,
      digest,
      address,
      keypair,
      packageID: oldPackageID,
      upgradeCap,
    });
    const {
      tx: upgradeTx,
      digest: upgradeDigest,
      events,
    } = await executeTx({
      tx,
      keyPair: keypair,
    });
    upgradeTx.objectChanges?.map((change) => {
      if (change.type === "published") {
        packageID = change.packageId;
      }
    });
    console.log("Upgraded DEX package:", {
      upgradeDigest,
      events,
      packageID,
    });

    const waitResult = await waitTx(upgradeDigest);
    if (waitResult.errors) {
      console.log(`Errors for tx ${upgradeDigest}:`, waitResult.errors);
    }
    assert.ok(!waitResult.errors, "upgrade transaction failed");
    assert.ok(packageID, "package ID is not set");
  });
});
