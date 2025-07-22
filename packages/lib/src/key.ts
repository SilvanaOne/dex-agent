import { CoinBalance } from "@mysten/sui/client";
// import {
//   getFaucetHost,
//   requestSuiFromFaucetV1,
//   requestSuiFromFaucetV2,
// } from "@mysten/sui/faucet";
import {
  silvanaFaucet,
  silvanaFaucetGetKey,
  silvanaFaucetPingKey,
  silvanaFaucetReturnKey,
} from "./faucet.js";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { suiClient, network } from "./sui-client.js";
import { sleep } from "./sleep.js";

let userSecretKey: string | undefined = undefined;

export async function getUserKey(
  params: { autoReturn: boolean } = { autoReturn: true }
): Promise<string> {
  const { autoReturn } = params;
  if (userSecretKey) return userSecretKey;
  const { secretKey } = await getKey({
    name: "user",
    autoReturn,
  });
  userSecretKey = secretKey;
  return secretKey;
}

export async function returnUserKey() {
  if (userSecretKey) {
    const key = userSecretKey;
    userSecretKey = undefined;
    try {
      await silvanaFaucetReturnKey({ secretKey: key });
    } catch (error: any) {
      console.error("return key error", error?.message);
    }
  }
}

export async function pingUserKey() {
  if (userSecretKey) {
    const address = Ed25519Keypair.fromSecretKey(userSecretKey).toSuiAddress();
    try {
      await silvanaFaucetPingKey({ address });
    } catch (error: any) {
      console.error("return key error", error?.message);
    }
  }
}

export function suiBalance(balance: CoinBalance): number {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
}

const MIN_SUI_BALANCE = 1;
const TOPUP_AMOUNT = 5;

export async function getKey(params: {
  secretKey?: string;
  name?: string;
  topup?: boolean;
  autoReturn?: boolean;
  minBalance?: number;
  topupAmount?: number;
}): Promise<{
  address: string;
  secretKey: string;
  keypair: Ed25519Keypair;
  balance?: CoinBalance;
}> {
  const { minBalance = MIN_SUI_BALANCE, topupAmount = TOPUP_AMOUNT } = params;
  let {
    topup = params.secretKey !== undefined,
    name = "",
    autoReturn = true,
  } = params;
  let secretKey: string | undefined = params.secretKey;
  let address: string;
  let keypair: Ed25519Keypair;
  if (!secretKey || secretKey === "0") {
    try {
      const key = await silvanaFaucetGetKey({ autoReturn });
      secretKey = key.key_pair.private_key_bech32;
      keypair = Ed25519Keypair.fromSecretKey(secretKey);
      address = key.key_pair.address;
      const balance = await suiClient.getBalance({
        owner: address,
        coinType: "0x2::sui::SUI",
      });
      if (suiBalance(balance) >= minBalance) {
        return {
          address,
          secretKey,
          keypair: Ed25519Keypair.fromSecretKey(secretKey),
          balance,
        };
      }
    } catch (error: any) {
      console.error("Faucet get key error:", error?.message);
      keypair = new Ed25519Keypair();
      secretKey = keypair.getSecretKey();
      topup = true;
    }
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
      suiBalance(balance) < minBalance &&
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
            amount: 1_000_000_000 * topupAmount,
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

export async function getSuiBalance(address: string): Promise<number> {
  try {
    const balance = await suiClient.getBalance({
      owner: address,
      coinType: "0x2::sui::SUI",
    });
    return suiBalance(balance);
  } catch (error: any) {
    console.error("getSuiBalance error:", error?.message);
    return 0;
  }
}

export async function getSuiAddress(params: {
  secretKey: string;
}): Promise<string> {
  return Ed25519Keypair.fromSecretKey(params.secretKey)
    .getPublicKey()
    .toSuiAddress();
}
