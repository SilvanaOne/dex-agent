import { saveToWalrus, readFromWalrus, getWalrusUrl } from "./walrus.js";
import { saveToIPFS, readFromIPFS, getIPFSUrl } from "./ipfs.js";
export const daProvider: "Walrus" | "IPFS" | "Project Untitled" = "Walrus" as
  | "Walrus"
  | "IPFS"
  | "Project Untitled";

export async function saveToDA({
  data,
  description,
  filename,
  address,
  days = 2,
}: {
  data: string;
  description?: string;
  filename?: string;
  address?: string;
  days?: number;
}): Promise<string | undefined> {
  if (daProvider === "Walrus") {
    return saveToWalrus({ data, address, numEpochs: days });
  } else if (daProvider === "IPFS") {
    return saveToIPFS({ data, owner: address, days, description, filename });
  } else if (daProvider === "Project Untitled") {
    throw new Error("Project Untitled support is not implemented yet");
  }
}

export async function readFromDA({
  blobId,
}: {
  blobId: string;
}): Promise<string | undefined> {
  if (!blobId) {
    throw new Error("blobId is not provided");
  }
  if (daProvider === "Walrus") {
    return readFromWalrus({ blobId });
  } else if (daProvider === "IPFS") {
    return readFromIPFS({ blobId });
  } else if (daProvider === "Project Untitled") {
    throw new Error("Project Untitled support is not implemented yet");
  } else {
    throw new Error("Invalid DA provider");
  }
}

export async function getDAUrl(params: { blobId: string }): Promise<string> {
  if (daProvider === "Walrus") {
    return getWalrusUrl(params);
  } else if (daProvider === "IPFS") {
    return getIPFSUrl(params);
  } else if (daProvider === "Project Untitled") {
    throw new Error("Project Untitled support is not implemented yet");
  } else {
    throw new Error("Invalid DA provider");
  }
}

export async function getDAMetadata(): Promise<
  | { chain: "pinata"; network: "public" }
  | { chain: "walrus"; network: "testnet" }
> {
  if (daProvider === "Walrus") {
    return { chain: "walrus", network: "testnet" };
  } else if (daProvider === "IPFS") {
    return { chain: "pinata", network: "public" };
  } else {
    throw new Error("Invalid DA provider");
  }
}
