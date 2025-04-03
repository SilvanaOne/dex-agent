import { CoinBalance } from "@mysten/sui/client";
import { getFaucetHost, requestSuiFromFaucetV1 } from "@mysten/sui/faucet";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { suiClient, network } from "./sui-client.js";

let userSecretKey: string | undefined = undefined;

export async function getUserKey(): Promise<string> {
  if (userSecretKey) return userSecretKey;
  const { address, keypair, secretKey } = await getKey({
    secretKey: userSecretKey,
    name: "user",
  });
  userSecretKey = secretKey;
  return secretKey;
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
  keypair: Secp256k1Keypair;
  balance?: CoinBalance;
}> {
  const { topup = true, name = "" } = params;
  let secretKey: string | undefined = params.secretKey;
  let address: string;
  let keypair: Secp256k1Keypair;
  if (!secretKey || secretKey === "0") {
    keypair = new Secp256k1Keypair();
    secretKey = keypair.getSecretKey();
  } else {
    keypair = Secp256k1Keypair.fromSecretKey(secretKey);
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
      const tx = await requestSuiFromFaucetV1({
        host: getFaucetHost(network),
        recipient: address,
      });
      console.log("Faucet tx task:", tx.task);
      if (tx.error) {
        console.error("Faucet tx error:", tx.error);
      }
      while (suiBalance(balance) < MIN_SUI_BALANCE) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        balance = await suiClient.getBalance({
          owner: address,
          coinType: "0x2::sui::SUI",
        });
      }
    }
    console.log(`${name} balance: ${suiBalance(balance)} SUI`);
  }

  console.log(`${name} address`, address);

  return { address, secretKey, keypair, balance };
}
