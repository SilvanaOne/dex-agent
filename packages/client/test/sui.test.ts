import { describe, it } from "node:test";
import assert from "node:assert";
import {
  CoinBalance,
  getFullnodeUrl,
  SuiClient,
  SuiEvent,
} from "@mysten/sui/client";
import { getFaucetHost, requestSuiFromFaucetV1 } from "@mysten/sui/faucet";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import crypto from "node:crypto";
import secp256k1 from "secp256k1";

const suiClient = new SuiClient({
  url: getFullnodeUrl("localnet"),
});

describe("Sui test", async () => {
  it("should test sui txs", async () => {
    const secretKey = process.env.PRIVATE_KEY!;
    const address = process.env.ADDRESS!;

    const keypair = Secp256k1Keypair.fromSecretKey(secretKey);
    const publicKey = keypair.getPublicKey();
    const calculatedAddress = publicKey.toSuiAddress();
    console.log("calculatedAddress", calculatedAddress);
    console.log("address", address);
    assert.strictEqual(calculatedAddress, address);
  });
});
