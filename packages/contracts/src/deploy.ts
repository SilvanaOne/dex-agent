import {
  PrivateKey,
  Field,
  VerificationKey,
  Mina,
  AccountUpdate,
  PublicKey,
} from "o1js";
import { DEXContract } from "./contracts/contract.js";
import {
  fetchMinaAccount,
  initBlockchain,
  accountBalanceMina,
  Memory,
  sendTx,
  pinJSON,
} from "@silvana-one/mina-utils";

const chain = process.env.MINA_CHAIN! as
  | "local"
  | "devnet"
  | "zeko"
  | "mainnet";
if (
  chain !== "local" &&
  chain !== "devnet" &&
  chain !== "zeko" &&
  chain !== "mainnet"
) {
  throw new Error(`Invalid chain: ${chain}`);
}

const expectedTxStatus = "pending";

export async function deployMinaContract(params: {
  poolPrivateKey: string;
  adminPrivateKey: string;
}): Promise<string> {
  console.time("deployed");

  await initBlockchain(chain);

  const CONTRACT_VERIFICATION_KEY_HASH =
    process.env.CONTRACT_VERIFICATION_KEY_HASH;
  const CONTRACT_VERIFICATION_KEY_DATA =
    process.env.CONTRACT_VERIFICATION_KEY_DATA;

  if (!CONTRACT_VERIFICATION_KEY_HASH || !CONTRACT_VERIFICATION_KEY_DATA) {
    throw new Error(
      "CONTRACT_VERIFICATION_KEY_HASH or CONTRACT_VERIFICATION_KEY_DATA is not set"
    );
  }

  const verificationKey = new VerificationKey({
    hash: Field(BigInt(CONTRACT_VERIFICATION_KEY_HASH)),
    data: CONTRACT_VERIFICATION_KEY_DATA,
  });

  const adminPrivateKey = PrivateKey.fromBase58(params.adminPrivateKey);
  const admin = adminPrivateKey.toPublicKey();
  const poolPrivateKey = PrivateKey.fromBase58(params.poolPrivateKey);
  const pool = poolPrivateKey.toPublicKey();

  console.log("DEX contract address:", pool.toBase58());

  console.log(
    "Admin",
    admin.toBase58(),
    "balance:",
    await accountBalanceMina(admin)
  );

  await fetchMinaAccount({ publicKey: admin, force: true });
  const dex = new DEXContract(pool);

  const tx = await Mina.transaction(
    {
      sender: admin,
      fee: 100_000_000,
      memo: `Deploy Silvana DEX Contract`,
    },
    async () => {
      AccountUpdate.fundNewAccount(admin, 1);

      await dex.deploy({
        admin: admin,
        uri: `DEX Contract`,
        verificationKey,
      });
    }
  );
  await tx.prove();
  const sentTx = await sendTx({
    tx: tx.sign([adminPrivateKey, poolPrivateKey]),
    description: "deploy DEX Contract",
    wait: false,
    verbose: true,
  });
  if (sentTx?.status !== expectedTxStatus) {
    console.error("sentTx", sentTx);
    throw new Error(`Deploy DEX Contract failed: ${sentTx?.status}`);
  }
  const hash = sentTx?.hash;
  console.timeEnd("deployed");
  return hash;
}

export async function checkMinaContractDeployment(params: {
  contractAddress: string;
  adminPublicKey: string;
}): Promise<boolean> {
  console.log("chain", chain);
  console.log("params", params);
  await initBlockchain(chain);
  const { contractAddress, adminPublicKey } = params;
  const contractPublicKey = PublicKey.fromBase58(contractAddress);
  const contract = new DEXContract(contractPublicKey);
  await fetchMinaAccount({ publicKey: contractPublicKey, force: false });
  if (!Mina.hasAccount(contractPublicKey)) {
    return false;
  }
  const admin = contract.admin.get();
  if (admin.toBase58() !== adminPublicKey) {
    console.error("Admin address mismatch");
    return false;
  }
  return true;
}
