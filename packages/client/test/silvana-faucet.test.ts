import { describe, it } from "node:test";
import assert from "node:assert";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { CoinBalance } from "@mysten/sui/client";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  silvanaFaucet,
  silvanaFaucetGetKey,
  silvanaFaucetReturnKey,
} from "@dex-agent/lib";

export const network: "testnet" | "devnet" | "localnet" | "mainnet" = "testnet";

export const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});

describe("Faucet", async () => {
  it("should get SUI from Silvana faucet", async () => {
    const keypair = Ed25519Keypair.generate();
    const secretKey = keypair.getSecretKey();
    console.log("secretKey", secretKey);
    const address = keypair.getPublicKey().toSuiAddress();
    console.log("address", address);
    const recovered_keypair = Ed25519Keypair.fromSecretKey(secretKey);
    const recovered_address = recovered_keypair.getPublicKey().toSuiAddress();
    console.log("recovered_address", recovered_address);
    assert.equal(address, recovered_address, "addresses do not match");
    console.time("faucet");
    try {
      const response = await silvanaFaucet({ address, amount: 10_000_000_000 });
      console.log("response", response);
      assert.ok(response.success, "faucet response is not success");
    } catch (error: any) {
      console.log("faucet error", error?.message);
    }
    console.timeEnd("faucet");
    console.time("balance");
    let balanceAfter = suiBalance(
      await suiClient.getBalance({
        owner: address,
        coinType: "0x2::sui::SUI",
      })
    );
    while (balanceAfter === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      balanceAfter = suiBalance(
        await suiClient.getBalance({
          owner: address,
          coinType: "0x2::sui::SUI",
        })
      );
    }
    console.log(`Faucet tx applied, current balance: ${balanceAfter} SUI`);
    console.timeEnd("balance");
  });

  it.skip("should get key from Silvana faucet", async () => {
    console.time("get key");
    const key = await silvanaFaucetGetKey();
    console.timeEnd("get key");
    assert.ok(key.success, "key response is not success");
    console.log("key", key);
    const address = key.key_pair.address;
    const balance = suiBalance(
      await suiClient.getBalance({
        owner: address,
        coinType: "0x2::sui::SUI",
      })
    );
    console.log("balance", balance);
    const privateKey = key.key_pair.private_key_bech32;
    // try {
    //   console.log("secp256k1");
    //   const keypair = Secp256k1Keypair.fromSecretKey(privateKey);
    //   const address = keypair.getPublicKey().toSuiAddress();
    //   console.log("address", address);
    // } catch (error: any) {
    //   console.log("secp256k1 error", error?.message);
    // }
    try {
      console.log("ed25519");
      const keypair = Ed25519Keypair.fromSecretKey(privateKey);
      const address = keypair.getPublicKey().toSuiAddress();
      console.log("address", address);
    } catch (error: any) {
      console.log("ed25519 error", error?.message);
    }
    console.time("return key");
    const response = await silvanaFaucetReturnKey({ address });
    console.timeEnd("return key");
    assert.ok(response.success, "return key response is not success");
    console.log("return key response", response);
  });
});

export function suiBalance(balance: CoinBalance): number {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
}

// export async function topup(params: { secretKey: string }): Promise<{
//   address: string;
// }> {
//   const { secretKey } = params;
//   let keypair: Secp256k1Keypair = Secp256k1Keypair.fromSecretKey(secretKey);
//   let address = keypair.getPublicKey().toSuiAddress();
//   let balance = await suiClient.getBalance({
//     owner: address,
//     coinType: "0x2::sui::SUI",
//   });
//   let balanceBefore = suiBalance(balance);
//   if (
//     balanceBefore < MIN_SUI_BALANCE &&
//     (network === "localnet" || network === "devnet" || network === "testnet")
//   ) {
//     console.log(
//       `Requesting SUI from faucet, current balance: ${balanceBefore} SUI`
//     );
//     const tx = await requestSuiFromFaucetV1({
//       host: getFaucetHost(network),
//       recipient: address,
//     });
//     console.log("Faucet tx", tx);
//     let balanceAfter = suiBalance(
//       await suiClient.getBalance({
//         owner: address,
//         coinType: "0x2::sui::SUI",
//       })
//     );
//     while (balanceAfter === balanceBefore) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       balanceAfter = suiBalance(
//         await suiClient.getBalance({
//           owner: address,
//           coinType: "0x2::sui::SUI",
//         })
//       );
//     }
//     console.log(`Faucet tx sent, current balance: ${balanceAfter} SUI`);
//   }

//   return { address };
// }
