import { describe, it } from "node:test";
import assert from "node:assert";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { CoinBalance } from "@mysten/sui/client";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { Transaction } from "@mysten/sui/transactions";

export const network: "testnet" | "devnet" | "localnet" | "mainnet" = "testnet";

export const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});

describe("Payment", async () => {
  it("should get SUI from Silvana faucet", async () => {
    const keypair = Secp256k1Keypair.fromSecretKey("");
    const address = keypair.getPublicKey().toSuiAddress();
    console.log("address", address);
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [1_000_000]);
    tx.transferObjects([coin], "");
    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    });
    console.log("result", result.digest);
    await suiClient.waitForTransaction({ digest: result.digest });
  });
});

export function suiBalance(balance: CoinBalance): number {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
}
