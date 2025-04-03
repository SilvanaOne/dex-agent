import { describe, it } from "node:test";
import assert from "node:assert";

import { readFile } from "node:fs/promises";
import { DexObjects } from "./helpers/dex.js";
import {
  fetchDexAccount,
  fetchSuiObject,
  fetchBlockProofs,
  publicKeyToU256,
  fetchDex,
  getOrderbook,
  findUserDeal,
  findDeal,
  fetchDexVersion,
  fetchEvents,
  getConfig,
  fetchDexEvents,
  fetchProofEvents,
  fetchSettlementTransactionEvents,
  getNetworkInfo,
} from "@dex-agent/lib";
import {
  fetchSequenceData,
  proveSequence,
  SequenceState,
} from "@dex-agent/contracts";
import { Cache } from "o1js";
import { serializeIndexedMap } from "@silvana-one/storage";
let dexObjects: DexObjects | undefined = undefined;

describe("Fetch DEX users accounts", async () => {
  it("should read configuration", async () => {
    const config = await readFile("./data/dex-objects.json", "utf-8");
    const { dexObjects: dexObjectsInternal } = JSON.parse(
      config,
      (key, value) => {
        if (
          typeof key === "string" &&
          (key.toLowerCase().endsWith("amount") ||
            key.toLowerCase().endsWith("price")) &&
          typeof value === "string" &&
          value.endsWith("n")
        ) {
          return BigInt(value.slice(0, -1));
        }
        return value;
      }
    ) as { dexObjects: DexObjects };
    dexObjects = dexObjectsInternal;
    if (!dexObjects) {
      throw new Error("DEX_OBJECTS is not set");
    }
  });

  it("should fetch DEX", async () => {
    const dex = await fetchDex();
    console.log("DEX", dex);
  });

  it("should fetch Network Info", async () => {
    const info = await getNetworkInfo();
    console.log("Network Info", info);
  });

  it.skip("should fetch DEX operations", async () => {
    const dex = await fetchDex();
    if (!dex) {
      throw new Error("DEX is not found");
    }
    let firstSequence = Number(dex.sequence) - 100;
    if (firstSequence < 0) {
      firstSequence = 0;
    }
    const events = await fetchDexEvents({
      firstSequence,
      lastSequence: Number(dex.sequence) - 1,
      limit: 100,
    });
    console.log("events", events);
  });

  it.skip("should fetch DEX proof events", async () => {
    const events = await fetchProofEvents({
      limit: 100,
    });
    console.log("events", events?.[0]);
  });

  it.skip("should fetch DEX L1 events", async () => {
    const events = await fetchSettlementTransactionEvents({
      limit: 100,
    });
    console.log("events", events);
  });

  it.skip("should fetch DEX version", async () => {
    console.time("fetchDexVersion");
    const version = await fetchDexVersion();
    console.timeEnd("fetchDexVersion");
    console.log("DEX version", version);
    console.time("fetchDexVersion");
    const version2 = await fetchDexVersion();
    console.timeEnd("fetchDexVersion");
    console.log("DEX version", version2);
    console.time("fetchDexVersion");
    const version3 = await fetchDexVersion();
    console.timeEnd("fetchDexVersion");
    console.log("DEX version", version3);
  });

  it.skip("should fetch DEX and print users, bids, offers", async () => {
    const dex = await fetchDex();
    console.log("bids", dex?.bids);
    console.log("offers", dex?.offers);
    console.log("users", dex?.users);
  });

  it.skip("should fetch DEX orderbook", async () => {
    const dex = await fetchDex();
    if (!dex) {
      throw new Error("DEX is not found");
    }
    const orderbook = getOrderbook(dex);
    console.log("orderbook", orderbook);
  });

  it.skip("should find user deals", async () => {
    console.time("fetch dex");
    const dex = await fetchDex();
    if (!dex) {
      throw new Error("DEX is not found");
    }
    console.timeEnd("fetch dex");
    console.time("calculate orderbook");
    const orderbook = getOrderbook(dex);
    for (const user of dex.users) {
      const deal = findUserDeal({
        dex,
        userPublicKey: user,
      });
      console.log(`${user}`, deal);
    }
    const deal = findDeal({
      dex,
      orderbook,
    });
    console.log("deal", deal);
    console.timeEnd("calculate orderbook");
  });

  it.skip("should fetch block proofs", async () => {
    const blockProofs = await fetchBlockProofs({
      blockNumber: 1,
    });
    console.log("block proofs", blockProofs);
  });

  it.skip("should fetch user", async () => {
    const user = await fetchSuiObject(
      "0x33ac72049a5c6c89cf022439c1b20e7857665911581bc9e53edbe565745d2e2d"
    );
    console.log("user", user);
    console.log("user display", user.data?.display?.data);
  });

  it.skip("should fetch user accounts", async () => {
    if (!dexObjects) {
      throw new Error("DEX_OBJECTS is not set");
    }
    const { faucet, alice, bob, pool } = dexObjects;
    const aliceAccount = await fetchDexAccount({
      addressU256: publicKeyToU256(alice.minaPublicKey),
    });
    console.log("alice account", aliceAccount);
  });

  it.skip("should fetch sequence data", async () => {
    console.time("fetchSequenceData");
    const sequenceData = await fetchSequenceData({
      sequence: 11,
      blockNumber: 1,
      prove: true,
      cache: Cache.FileSystem("./cache"),
    });
    //console.log("sequence data", sequenceData);
    if (!sequenceData) {
      throw new Error("Sequence data is not received");
    }
    const proof = sequenceData.dexProof;
    if (!proof) {
      throw new Error("Proof is not received");
    }
    console.timeEnd("fetchSequenceData");
    const str = sequenceData.toJSON();
    const state = await SequenceState.fromJSON(str);
    assert.deepEqual(state.blockNumber, sequenceData.blockNumber);
    assert.deepEqual(state.sequences, sequenceData.sequences);
    assert.deepEqual(
      state.dexState.toRollupData(),
      sequenceData.dexState.toRollupData()
    );
    assert.deepEqual(
      serializeIndexedMap(state.map),
      serializeIndexedMap(sequenceData.map)
    );
    assert.deepEqual(state.accounts, sequenceData.accounts);
    assert.deepEqual(state.dexProof?.toJSON(), sequenceData.dexProof?.toJSON());
  });
});
