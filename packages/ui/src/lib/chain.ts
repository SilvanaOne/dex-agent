import { MinaNetworkParams, Mainnet, Devnet, Zeko } from "./networks";

const SUI_CHAIN = process.env.NEXT_PUBLIC_SUI_CHAIN;
if (!SUI_CHAIN) throw new Error("NEXT_PUBLIC_SUI_CHAIN is undefined");

export function getChain(): "mainnet" | "devnet" | "zeko" {
  const chain = process.env.NEXT_PUBLIC_MINA_CHAIN;
  if (chain === undefined)
    throw new Error("NEXT_PUBLIC_MINA_CHAIN is undefined");
  if (chain !== "devnet" && chain !== "mainnet" && chain !== "zeko")
    throw new Error("NEXT_PUBLIC_MINA_CHAIN must be devnet or mainnet or zeko");
  return chain;
}

export function getChainId(): "mina:mainnet" | "mina:devnet" | "zeko:testnet" {
  const chain = getChain();
  const chainId = [Mainnet, Devnet, Zeko].find(
    (network) => network.chain === chain
  )?.chainId;
  if (
    chainId !== "mina:mainnet" &&
    chainId !== "mina:devnet" &&
    chainId !== "zeko:testnet"
  )
    throw new Error(
      "chainId must be mina:mainnet or mina:devnet or zeko:testnet"
    );
  return chainId;
}

export function getUrl(): string {
  const chain = getChain();
  const url = [Mainnet, Devnet, Zeko].find(
    (network) => network.chain === chain
  )?.url;
  if (url === undefined) throw new Error("url is undefined");
  return url;
}

// export function getWallet(): string {
//   const wallet = process.env.NEXT_PUBLIC_WALLET;
//   if (wallet === undefined) throw new Error("NEXT_PUBLIC_WALLET is undefined");
//   return wallet;
// }

export function getNetwork(): MinaNetworkParams {
  const chain = getChain();
  switch (chain) {
    case "mainnet":
      return Mainnet;
    case "devnet":
      return Devnet;
    case "zeko":
      return Zeko;
    default:
      throw new Error("Chain not supported");
  }
}

export function explorerAccountUrl(): string {
  const network = getNetwork();
  return network.explorerAccountUrl;
}

export function explorerTransactionUrl(): string {
  const network = getNetwork();
  return network.explorerTransactionUrl;
}

export function explorerTokenUrl(): string {
  const network = getNetwork();
  return network.explorerTokenUrl;
}

export function suiExplorerTxUrl(tx: string): string {
  return `https://suiscan.xyz/${SUI_CHAIN}/tx/${tx}`;
}

export function suiExplorerObjectUrl(object: string): string {
  return `https://suiscan.xyz/${SUI_CHAIN}/object/${object}`;
}

export function daUrl(daHash: string): string {
  return `/api/v1/data-availability?url=${encodeURIComponent(daHash)}`;
}

export function getSiteName(): string {
  const chain = getChain();
  if (chain === "mainnet") return "Silvana DEX";
  if (chain === "devnet") return "Silvana DEX Devnet";
  if (chain === "zeko") return "Silvana DEX Zeko";
  throw new Error("Chain not supported");
}
