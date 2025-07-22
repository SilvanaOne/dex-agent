import { describe, it } from "node:test";
import assert from "node:assert";

import { Transaction } from "@mysten/sui/transactions";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";
import { getKey, suiClient, executeTx, waitTx } from "@dex-agent/lib";
import { fetchSequenceData } from "@dex-agent/contracts";
import { fetchBlock, fetchDex } from "@dex-agent/lib";
import { readFromDA, saveToDA } from "@dex-agent/lib";
import { ProvableBlockData } from "@dex-agent/contracts";
import { writeFile } from "node:fs/promises";
import { serializeIndexedMap } from "@silvana-one/storage";
import { calculateStateRoot } from "@dex-agent/contracts";

const adminSecretKey: string = process.env.ADMIN_SECRET_KEY!;
const adminAddress: string = process.env.ADMIN!;
if (!adminSecretKey) {
  throw new Error("Missing environment variables");
}

const packageID = process.env.PACKAGE_ID;
const dexID = process.env.DEX_ID;
const adminID = process.env.ADMIN_ID;
let lastBlockNumber: number | undefined = undefined;
let blockBlobId: string | undefined = undefined;

describe("DEX Block Data Availability", async () => {
  it("should find last block with data availability", async () => {
    if (!packageID) {
      throw new Error("PACKAGE_ID is not set");
    }

    if (!dexID) {
      throw new Error("DEX_ID is not set");
    }

    if (!adminID) {
      throw new Error("ADMIN_ID is not set");
    }
    const dex = await fetchDex();
    if (!dex) {
      throw new Error("DEX is not set");
    }
    let blockNumber = dex.block_number - 1;
    while (!lastBlockNumber && blockNumber >= 0) {
      const block = await fetchBlock({ blockNumber });
      console.log(`block:`, block.block.block_number);
      if (block.block.state_data_availability) {
        lastBlockNumber = block.block.block_number + 1;
      } else {
        blockNumber--;
      }
    }
    console.log(`lastBlockNumber:`, lastBlockNumber);
  });
  it("should save block and block state to Walrus", async () => {
    if (!lastBlockNumber) {
      throw new Error("last block number is not set");
    }

    if (!adminAddress) {
      throw new Error("admin address is not set");
    }

    const blockData = await fetchBlock({
      blockNumber: lastBlockNumber,
      fetchState: true,
      fetchEvents: true,
    });
    if (!blockData.state) {
      throw new Error("block state is not set");
    }
    if (!blockData.events) {
      throw new Error("block events are not set");
    }
    const sequenceData = await fetchSequenceData({
      sequence: blockData.block.block_state.sequence,
      blockNumber: blockData.block.block_number,
    });
    if (!sequenceData) {
      throw new Error("sequence data is not set");
    }
    const root = await calculateStateRoot({
      state: blockData.state.state,
    });
    if (root !== sequenceData.map.root.toBigInt()) {
      throw new Error("state root does not match");
    }
    const provableBlockData: ProvableBlockData = new ProvableBlockData({
      ...blockData,
      state: blockData.state,
      events: blockData.events,
      map: serializeIndexedMap(sequenceData.map),
    });
    blockBlobId = await saveToDA({
      data: provableBlockData.serialize(),
      address: adminAddress,
      days: 5,
    });
    console.log(`block blobId:`, blockBlobId);
  });
  it("should read block and block state from Walrus", async () => {
    if (!blockBlobId) {
      throw new Error("block blobId is not set");
    }

    const block = await readFromDA({
      blobId: blockBlobId,
    });
    //console.log(`block:`, block);
    if (!block) {
      throw new Error("block is not received");
    }
    const blockData = ProvableBlockData.deserialize(block);
    await writeFile(`./data/block-${blockData.block.block_number}.json`, block);
  });
  it("should save block and block state blobIds to Sui", async () => {
    if (!packageID) {
      throw new Error("PACKAGE_ID is not set");
    }

    if (!dexID) {
      throw new Error("DEX_ID is not set");
    }

    if (!adminID) {
      throw new Error("ADMIN_ID is not set");
    }

    if (!lastBlockNumber) {
      throw new Error("last block number is not set");
    }

    if (!blockBlobId) {
      throw new Error("BLOCK_BLOB_ID is not set");
    }

    const { address, keypair } = await getKey({
      secretKey: adminSecretKey,
      name: "admin",
      minBalance: 1,
      topupAmount: 5,
    });

    /*
public fun update_block_state_data_availability(
    admin: &Admin,
    block: &mut Block,
    state_data_availability: String,
    clock: &Clock,
    ctx: &mut TxContext,
    */

    const tx = new Transaction();

    const blockArguments = [
      tx.object(dexID),
      tx.pure.u64(lastBlockNumber),
      tx.pure.string(blockBlobId),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ];

    tx.moveCall({
      package: packageID,
      module: "main",
      function: "update_block_state_data_availability",
      arguments: blockArguments,
    });

    tx.setSender(address);
    tx.setGasBudget(100_000_000);

    // const signedTx = await tx.sign({
    //   signer: keypair,
    //   client: suiClient,
    // });

    const {
      tx: updateBlockTx,
      digest,
      events,
    } = await executeTx({
      tx,
      keyPair: keypair,
    });
    console.log(`update block tx:`, {
      digest,
      events,
    });
    console.log(`tx objects:`, updateBlockTx.objectChanges);

    const waitResult = await waitTx(digest);
    if (waitResult.errors) {
      console.log(`Errors for tx ${digest}:`, waitResult.errors);
    }
    assert.ok(!waitResult.errors, "update block transaction failed");
  });
});
