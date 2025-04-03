import * as api from "@silvana-one/api";

export async function getNonce(params: {
  address: string;
  chain: "devnet" | "zeko" | "mainnet";
}): Promise<number | undefined> {
  const { address, chain } = params;
  if (!process.env.MINATOKENS_API_KEY) {
    throw new Error("MINATOKENS_API_KEY is not set");
  }
  if (!address) {
    throw new Error("address is not set");
  }
  if (!chain) {
    throw new Error("chain is not set");
  }
  try {
    api.config({
      apiKey: process.env.MINATOKENS_API_KEY,
      chain,
    });
    const response = await api.getNonce({
      body: {
        address,
      },
    });
    return response?.data?.nonce;
  } catch (error: any) {
    console.error("Error getting nonce", error?.message);
    return undefined;
  }
}
