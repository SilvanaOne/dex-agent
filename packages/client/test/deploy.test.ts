import { describe, it } from "node:test";
import assert from "node:assert";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";
import {
  getKey,
  suiClient,
  buildPublishTx,
  executeTx,
  waitTx,
  publicKeyToU256,
  BlockData,
  fetchBlock,
  saveToDA,
  readFromDA,
} from "@dex-agent/lib";
import { writeFile } from "node:fs/promises";
import { buildMovePackage } from "../src/build.js";
import { createInitialState, DexObjects } from "./helpers/dex.js";
import { updateConfig } from "../src/config.js";
import {
  deployMinaContract,
  DEXMap,
  ProvableBlockData,
} from "@dex-agent/contracts";
import { TokenId } from "o1js";
import { serializeIndexedMap, sleep } from "@silvana-one/storage";

// const userSecretKeys: string[] = [
//   process.env.SECRET_KEY_1!,
//   process.env.SECRET_KEY_2!,
//   process.env.SECRET_KEY_3!,
// ];

const adminAddress: string = process.env.ADMIN!;
const adminSecretKey: string = process.env.ADMIN_SECRET_KEY!;
const validatorSecretKey: string = process.env.VALIDATOR_SECRET_KEY!;
// const proverSecretKey: string = process.env.PROVER_SECRET_KEY!;
const minaAdminSecretKey: string = process.env.TEST_ACCOUNT_1_PRIVATE_KEY!;

if (
  !adminAddress ||
  !adminSecretKey ||
  !validatorSecretKey ||
  // !proverSecretKey ||
  !minaAdminSecretKey
) {
  throw new Error("Missing environment variables");
}
// userSecretKeys.map((secretKey) => {
//   if (!secretKey) {
//     throw new Error("Missing environment variables");
//   }
// });

let packageID: string | undefined = undefined;
let adminID: string | undefined = undefined;
let dexID: string | undefined = undefined;
let blockID: string | undefined = undefined;
let blockBlobId: string | undefined = undefined;
let dexObjects: DexObjects | undefined = undefined;
let minaContractHash: string | undefined = undefined;
let minaContractAddress: string | undefined = undefined;

describe("Deploy DEX contracts", async () => {
  it("should deploy Mina DEX contract", async () => {
    dexObjects = createInitialState();
    const { pool } = dexObjects;
    if (!pool || !pool.minaPrivateKey || !pool.minaPublicKey) {
      throw new Error("Pool private key is not set");
    }
    minaContractAddress = pool.minaPublicKey;
    const hash = await deployMinaContract({
      adminPrivateKey: minaAdminSecretKey,
      poolPrivateKey: pool.minaPrivateKey,
    });
    console.log("Mina DEX contract deployed:", {
      hash,
      address: minaContractAddress,
    });
    minaContractHash = hash;
    assert.ok(minaContractHash, "Mina DEX contract hash is not set");
    assert.ok(minaContractAddress, "Mina DEX contract address is not set");
  });
  it("should publish SUI DEX package", async () => {
    if (!minaContractHash) {
      throw new Error("Mina DEX contract hash is not set");
    }
    const { keypair } = await getKey({
      secretKey: adminSecretKey,
      name: "admin",
      minBalance: 1,
      topupAmount: 5,
    });
    const { modules, dependencies } = await buildMovePackage("../coordination");
    const { tx } = await buildPublishTx({
      modules,
      dependencies,
      keypair,
    });
    const result = await executeTx({
      tx,
      keyPair: keypair,
    });
    if (!result) {
      throw new Error("Failed to publish DEX package");
    }
    const { tx: publishTx, digest, events } = result;
    publishTx.objectChanges?.map((change) => {
      if (change.type === "published") {
        packageID = change.packageId;
      } else if (
        change.type === "created" &&
        change.objectType.includes("admin::Admin") &&
        !change.objectType.includes("display")
      ) {
        adminID = change.objectId;
      }
    });
    console.log("Published DEX package:", {
      digest,
      events,
      packageID,
      adminID,
    });

    const waitResult = await waitTx(digest);
    if (waitResult.errors) {
      console.log(`Errors for tx ${digest}:`, waitResult.errors);
    }
    assert.ok(!waitResult.errors, "publish transaction failed");
    assert.ok(packageID, "package ID is not set");
    assert.ok(adminID, "ADMIN ID is not set");
  });

  it("should create DEX", async () => {
    if (!packageID) {
      throw new Error("PACKAGE_ID is not set");
    }

    if (!adminID) {
      throw new Error("ADMIN_ID is not set");
    }

    const CIRCUIT_BLOB_ID = process.env.CIRCUIT_BLOB_ID!;
    if (!CIRCUIT_BLOB_ID) {
      throw new Error("CIRCUIT_BLOB_ID is not set");
    }
    const CIRCUIT_VERIFICATION_KEY_HASH =
      process.env.CIRCUIT_VERIFICATION_KEY_HASH!;
    if (!CIRCUIT_VERIFICATION_KEY_HASH) {
      throw new Error("CIRCUIT_VERIFICATION_KEY_HASH is not set");
    }

    const CIRCUIT_VERIFICATION_KEY_DATA =
      process.env.CIRCUIT_VERIFICATION_KEY_DATA!;
    if (!CIRCUIT_VERIFICATION_KEY_DATA) {
      throw new Error("CIRCUIT_VERIFICATION_KEY_DATA is not set");
    }

    const { address, keypair } = await getKey({
      secretKey: adminSecretKey,
      name: "admin",
      minBalance: 1,
      topupAmount: 5,
    });

    const { keypair: validator } = await getKey({
      secretKey: validatorSecretKey,
      name: "validator",
      topup: false,
    });

    if (!dexObjects) {
      throw new Error("DEX objects are not set");
    }

    const { baseToken, quoteToken, pool } = dexObjects;

    const tx = new Transaction();

    /*
        public fun create_dex(
            admin: &Admin,
            public_key: vector<u8>,
            // Circuit
            circuit_name: String,
            circuit_description: String,
            circuit_package_da_hash: String,
            circuit_verification_key_hash: u256,
            circuit_verification_key_data: String,
            // Token 1
            base_token_publicKey: u256,
            base_token_publicKeyBase58: String,
            base_token_tokenId: u256,
            base_token_token: String,
            base_token_name: String,
            base_token_description: String,
            base_token_image: String,
            // Token 2
            quote_token_publicKey: u256,
            quote_token_publicKeyBase58: String,
            quote_token_tokenId: u256,
            quote_token_token: String,
            quote_token_name: String,
            quote_token_description: String,
            quote_token_image: String,
            // Pool
            pool_name: String,
            pool_publicKey: u256,
            pool_publicKeyBase58: String,
            initial_price: u64,
            clock: &Clock,
            ctx: &mut TxContext,
    */

    const dexArguments = [
      tx.object(adminID),
      tx.pure.vector("u8", validator.getPublicKey().toRawBytes()),
      // Circuit
      tx.pure.string("DEX Circuit"),
      tx.pure.string("DEX Rollup Circuits for Mina protocol"),
      tx.pure.string(CIRCUIT_BLOB_ID),
      tx.pure.u256(BigInt(CIRCUIT_VERIFICATION_KEY_HASH)),
      tx.pure.string(CIRCUIT_VERIFICATION_KEY_DATA),
      // Token 1
      tx.pure.u256(publicKeyToU256(baseToken.minaPublicKey)),
      tx.pure.string(baseToken.minaPublicKey),
      tx.pure.u256(TokenId.fromBase58(baseToken.tokenId).toBigInt()),
      tx.pure.string(baseToken.token),
      tx.pure.string(baseToken.name),
      tx.pure.string(baseToken.description),
      tx.pure.string(baseToken.image),
      // Token 2
      tx.pure.u256(publicKeyToU256(quoteToken.minaPublicKey)),
      tx.pure.string(quoteToken.minaPublicKey),
      tx.pure.u256(TokenId.fromBase58(quoteToken.tokenId).toBigInt()),
      tx.pure.string(quoteToken.token),
      tx.pure.string(quoteToken.name),
      tx.pure.string(quoteToken.description),
      tx.pure.string(quoteToken.image),
      // Pool
      tx.pure.string(pool.name),
      tx.pure.u256(publicKeyToU256(pool.minaPublicKey)),
      tx.pure.string(pool.minaPublicKey),
      tx.pure.u64(pool.lastPrice),
      // Clock
      tx.object(SUI_CLOCK_OBJECT_ID),
    ];

    tx.moveCall({
      package: packageID,
      module: "main",
      function: "create_dex",
      arguments: dexArguments,
    });

    tx.setSender(address);
    tx.setGasBudget(150_000_000);
    // const signedTx = await tx.sign({
    //   signer: keypair,
    //   client: suiClient,
    // });

    const result = await executeTx({
      tx,
      keyPair: keypair,
    });
    if (!result) {
      throw new Error("Failed to create DEX");
    }
    const { tx: initTx, digest, events } = result;
    console.log("initTx", initTx.objectChanges);
    initTx.objectChanges?.map((change) => {
      if (
        change.type === "created" &&
        change.objectType.includes("main::DEX") &&
        !change.objectType.includes("display")
      ) {
        dexID = change.objectId;
      }
      if (
        change.type === "created" &&
        change.objectType.includes("main::Block") &&
        !change.objectType.includes("display")
      ) {
        blockID = change.objectId;
      }
    });
    console.log("Created DEX:", {
      initTx,
      objectChanges: initTx.objectChanges,
      digest,
      events,
      dexID,
      blockID,
    });
    const waitResult = await waitTx(digest);
    if (waitResult.errors) {
      console.log(`Errors for tx ${digest}:`, waitResult.errors);
    }
    assert.ok(!waitResult.errors, "create DEX transaction failed");
    assert.ok(dexID, "DEX ID is not set");
    await updateConfig({
      dex_package: packageID,
      dex_object: dexID,
      circuit_blob_id: CIRCUIT_BLOB_ID,
      mina_chain: process.env.MINA_CHAIN || "devnet",
      mina_contract: minaContractAddress,
      mina_network: "mina",
    });
  });

  it("should save block and block state to Walrus", async () => {
    await sleep(5000);
    if (!blockID) {
      throw new Error("block ID is not set");
    }

    const blockData = await fetchBlock({
      blockNumber: 0,
      fetchState: true,
      fetchEvents: true,
    });
    if (!blockData.state) {
      throw new Error("block state is not set");
    }
    if (!blockData.events) {
      throw new Error("block events are not set");
    }
    const map = new DEXMap();
    const provableBlockData: ProvableBlockData = new ProvableBlockData({
      ...blockData,
      state: blockData.state,
      events: blockData.events,
      map: serializeIndexedMap(map),
    });

    blockBlobId = await saveToDA({
      data: provableBlockData.serialize(),
      address: adminAddress,
      days: 5,
      filename: "dex-block0.json",
      description: "block 0",
    });
    console.log(`block blobId:`, blockBlobId);
  });
  it("should read block and block state from Walrus", async () => {
    await sleep(5000);
    if (!blockBlobId) {
      throw new Error("block blobId is not set");
    }
    const blockString = await readFromDA({
      blobId: blockBlobId,
    });
    if (!blockString) {
      throw new Error("block is not received");
    }
    const block = ProvableBlockData.deserialize(blockString);
    //console.log(`block:`, block);
    if (!block) {
      throw new Error("block is not received");
    }
    await writeFile(
      `./data/block-${block.block.block_number}.json`,
      blockString
    );
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

    if (!blockID) {
      throw new Error("BLOCK_ID is not set");
    }

    if (!blockBlobId) {
      throw new Error("BLOCK_BLOB_ID is not set");
    }

    if (!minaContractHash) {
      throw new Error("MINA_CONTRACT_HASH is not set");
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
      tx.pure.u64(BigInt(0)),
      tx.pure.string(blockBlobId),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ];

    tx.moveCall({
      package: packageID,
      module: "main",
      function: "update_block_state_data_availability",
      arguments: blockArguments,
    });

    /*
        public fun update_block_mina_tx_hash(
            admin: &Admin,
            block: &mut Block,
            mina_tx_hash: String,
            clock: &Clock,
            ctx: &mut TxContext,
    */

    const minaTxHashArguments = [
      tx.object(dexID),
      tx.pure.u64(BigInt(0)),
      tx.pure.string(minaContractHash),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ];

    tx.moveCall({
      package: packageID,
      module: "main",
      function: "update_block_mina_tx_hash",
      arguments: minaTxHashArguments,
    });

    tx.setSender(address);
    tx.setGasBudget(100_000_000);

    // const signedTx = await tx.sign({
    //   signer: keypair,
    //   client: suiClient,
    // });

    const result = await executeTx({
      tx,
      keyPair: keypair,
    });
    if (!result) {
      throw new Error("Failed to update block");
    }
    const { tx: updateBlockTx, digest, events } = result;
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

  it("should save object IDs to .env.contracts", async () => {
    const CIRCUIT_BLOB_ID = process.env.CIRCUIT_BLOB_ID!;
    if (!CIRCUIT_BLOB_ID) {
      throw new Error("CIRCUIT_BLOB_ID is not set");
    }
    const envContent = `# Chains
SUI_CHAIN=${process.env.SUI_CHAIN}
MINA_CHAIN=${process.env.MINA_CHAIN}

# Package ID
PACKAGE_ID=${packageID}

# Object IDs
ADMIN_ID=${adminID}
DEX_ID=${dexID}
CIRCUIT_BLOB_ID=${CIRCUIT_BLOB_ID}

# Mina DEX contract
MINA_DEX_CONTRACT_ADDRESS=${minaContractAddress}
MINA_DEX_CONTRACT_DEPLOY_TX_HASH=${minaContractHash}
`;
    await writeFile(".env.public", envContent);
  });

  it("should save DEX objects to data folder", async () => {
    await writeFile(
      "./data/dex-objects.json",
      JSON.stringify(
        { dexObjects },
        (_, value) =>
          typeof value === "bigint" ? value.toString() + "n" : value,
        2
      )
    );
  });
});
