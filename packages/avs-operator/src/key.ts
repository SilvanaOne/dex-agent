import { ethers } from "ethers";

function generateKey() {
  const key = ethers.Wallet.createRandom().privateKey;
  console.log(`Generated private key: ${key}`);
  const address = new ethers.Wallet(key).address;
  console.log(`Generated address: ${address}`);
}

generateKey();
