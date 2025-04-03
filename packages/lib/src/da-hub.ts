import { saveToWalrus, readFromWalrus, getWalrusUrl } from "./walrus.js";
import { saveToIPFS, readFromIPFS, getIPFSUrl } from "./ipfs.js";
export const daProvider: "Walrus" | "IPFS" = "IPFS" as "Walrus" | "IPFS";

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
  } else {
    return saveToIPFS({ data, owner: address, days, description, filename });
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
  } else {
    return readFromIPFS({ blobId });
  }
}

export async function getDAUrl(params: { blobId: string }): Promise<string> {
  if (daProvider === "Walrus") {
    return getWalrusUrl(params);
  } else {
    return getIPFSUrl(params);
  }
}
