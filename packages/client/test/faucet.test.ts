import { describe, it } from "node:test";
import assert from "node:assert";
import { getFullnodeUrl, SuiClient, SuiEvent } from "@mysten/sui/client";
import { CoinBalance } from "@mysten/sui/client";
import { getFaucetHost, requestSuiFromFaucetV1 } from "@mysten/sui/faucet";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";

const MIN_SUI_BALANCE = 1000;

export const network: "testnet" | "devnet" | "localnet" | "mainnet" = "testnet";

export const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});
const adminSecretKey: string = process.env.ADMIN_SECRET_KEY!;

describe("Faucet", async () => {
  it("should get SUI from faucet", async () => {
    const { address } = await topup({ secretKey: adminSecretKey });
    console.log("Admin address", address);
  });
});

export function suiBalance(balance: CoinBalance): number {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
}

export async function topup(params: { secretKey: string }): Promise<{
  address: string;
}> {
  const { secretKey } = params;
  let keypair: Secp256k1Keypair = Secp256k1Keypair.fromSecretKey(secretKey);
  let address = keypair.getPublicKey().toSuiAddress();
  let balance = await suiClient.getBalance({
    owner: address,
    coinType: "0x2::sui::SUI",
  });
  let balanceBefore = suiBalance(balance);
  if (
    balanceBefore < MIN_SUI_BALANCE &&
    (network === "localnet" || network === "devnet" || network === "testnet")
  ) {
    console.log(
      `Requesting SUI from faucet, current balance: ${balanceBefore} SUI`
    );
    const tx = await requestSuiFromFaucetV1({
      host: getFaucetHost(network),
      recipient: address,
    });
    console.log("Faucet tx", tx);
    let balanceAfter = suiBalance(
      await suiClient.getBalance({
        owner: address,
        coinType: "0x2::sui::SUI",
      })
    );
    while (balanceAfter === balanceBefore) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      balanceAfter = suiBalance(
        await suiClient.getBalance({
          owner: address,
          coinType: "0x2::sui::SUI",
        })
      );
    }
    console.log(`Faucet tx sent, current balance: ${balanceAfter} SUI`);
  }

  return { address };
}
