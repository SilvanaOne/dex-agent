import { CoinBalance } from "@mysten/sui/client";
// import {
//   getFaucetHost,
//   requestSuiFromFaucetV1,
//   requestSuiFromFaucetV2,
// } from "@mysten/sui/faucet";
import {
  silvanaFaucet,
  silvanaFaucetGetKey,
  silvanaFaucetReturnKey,
} from "./faucet.js";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { suiClient, network } from "./sui-client.js";
import { sleep } from "./sleep.js";

let userSecretKey: string | undefined = undefined;

export async function getUserKey(): Promise<string> {
  if (userSecretKey) return userSecretKey;
  const { secretKey } = await getKey({
    name: "user",
  });
  userSecretKey = secretKey;
  return secretKey;
}

export async function returnUserKey() {
  if (!userSecretKey) {
    return;
  }
  try {
    const address = Ed25519Keypair.fromSecretKey(userSecretKey)
      .getPublicKey()
      .toSuiAddress();
    await silvanaFaucetReturnKey({ address });
  } catch (error: any) {
    console.error("return key error", error?.message);
  }
}

export function suiBalance(balance: CoinBalance): number {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
}

const MIN_SUI_BALANCE = 5;

export async function getKey(params: {
  secretKey?: string;
  name?: string;
  topup?: boolean;
}): Promise<{
  address: string;
  secretKey: string;
  keypair: Ed25519Keypair;
  balance?: CoinBalance;
}> {
  let { topup = params.secretKey !== undefined, name = "" } = params;
  let secretKey: string | undefined = params.secretKey;
  let address: string;
  let keypair: Ed25519Keypair;
  let topup_amount = 1_000_000_000 * MIN_SUI_BALANCE;
  if (!secretKey || secretKey === "0") {
    try {
      const key = await silvanaFaucetGetKey();
      secretKey = key.key_pair.private_key_bech32;
      address = key.key_pair.address;
      const balance = await suiClient.getBalance({
        owner: address,
        coinType: "0x2::sui::SUI",
      });
      return {
        address,
        secretKey,
        keypair: Ed25519Keypair.fromSecretKey(secretKey),
        balance,
      };
    } catch (error: any) {
      console.error("Faucet get key error:", error?.message);
    }
    keypair = new Ed25519Keypair();
    secretKey = keypair.getSecretKey();
    topup = true;
    topup_amount = 1_000_000_000;
  } else {
    keypair = Ed25519Keypair.fromSecretKey(secretKey);
  }
  let balance: CoinBalance | undefined;
  address = keypair.getPublicKey().toSuiAddress();
  if (topup) {
    balance = await suiClient.getBalance({
      owner: address,
      coinType: "0x2::sui::SUI",
    });
    if (
      suiBalance(balance) < MIN_SUI_BALANCE &&
      (network === "localnet" || network === "devnet" || network === "testnet")
    ) {
      console.log(
        `Requesting SUI from faucet, current balance: ${suiBalance(
          balance
        )} SUI`
      );
      let received = false;
      let attempts = 0;
      const maxAttempts = 10;
      while (!received && attempts < maxAttempts) {
        attempts++;
        try {
          const tx = await silvanaFaucet({
            address,
            amount: 1_000_000_000 * MIN_SUI_BALANCE,
          });
          console.log("Faucet reply:", tx.success);
          received = true;
        } catch (error: any) {
          console.error("Faucet tx error:", error?.message);
          await sleep(1000);
        }
      }
      // while (suiBalance(balance) < MIN_SUI_BALANCE) {
      //   await new Promise((resolve) => setTimeout(resolve, 100));
      //   balance = await suiClient.getBalance({
      //     owner: address,
      //     coinType: "0x2::sui::SUI",
      //   });
      // }
      balance = await suiClient.getBalance({
        owner: address,
        coinType: "0x2::sui::SUI",
      });
    }
    console.log(`${name} balance: ${suiBalance(balance)} SUI`);
  }

  console.log(`${name} address`, address);

  return { address, secretKey, keypair, balance };
}
