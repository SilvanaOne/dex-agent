import { PrivateKey, PublicKey } from "o1js";
import { DEXContract } from "./contracts/contract.js";
import { fetchMinaAccount, initBlockchain } from "@silvana-one/mina-utils";
import { fetchBlock, fetchDex, getConfig } from "@dex-agent/lib";
import { checkMinaContractDeployment } from "./deploy.js";

const minaAdminSecretKey: string = process.env.MINA_ADMIN_PRIVATE_KEY!;

export async function monitor(params: {
  chain: "devnet" | "zeko" | "mainnet";
}): Promise<boolean> {
  const { chain } = params;
  if (!minaAdminSecretKey) {
    throw new Error("MINA_ADMIN_PRIVATE_KEY is not set");
  }

  const config = await getConfig();
  const poolPublicKey = config.mina_contract;
  if (!poolPublicKey) {
    throw new Error("Mina contract is not set");
  }
  await initBlockchain(chain);
  const dexContract = new DEXContract(PublicKey.fromBase58(poolPublicKey));
  const isDeployed = await checkMinaContractDeployment({
    contractAddress: poolPublicKey,
    adminPublicKey: PrivateKey.fromBase58(minaAdminSecretKey)
      .toPublicKey()
      .toBase58(),
  });

  if (!isDeployed) {
    console.error("monitor: Mina contract is not deployed");
    return false;
  }
  await fetchMinaAccount({ publicKey: poolPublicKey, force: true });
  const contractBlockNumber = Number(dexContract.blockNumber.get().toBigInt());
  console.log("monitor: contractBlockNumber", contractBlockNumber);

  const dex = await fetchDex();
  if (!dex) {
    throw new Error("DEX is not received");
  }
  console.log("current_block_number", dex.block_number);
  console.log("last proved block", dex.last_proved_block_number);

  if (dex.block_number === contractBlockNumber + 1) {
    const block = await fetchBlock({
      blockNumber: Number(dex.last_proved_block_number),
    });
    console.log("block tx included:", block.block.mina_tx_included_in_block);
    if (block.block.mina_tx_included_in_block) return false;
  }
  return true;
}
