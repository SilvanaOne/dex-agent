const daemon: "local" | "testnet" = "local" as "local" | "testnet";
const basePublisherUrl =
  daemon === "local"
    ? "http://127.0.0.1:31415"
    : "https://wal-publisher-testnet.staketab.org";
//"https://publisher.walrus-testnet.walrus.space";
const readerUrl =
  daemon === "local"
    ? "http://127.0.0.1:31415/v1/blobs/"
    : "https://wal-aggregator-testnet.staketab.org/v1/blobs/";
//"https://aggregator.walrus-testnet.walrus.space/v1/blobs/";

export async function saveToWalrus({
  data,
  address,
  numEpochs = 2,
}: {
  data: string;
  address?: string;
  numEpochs?: number;
}): Promise<string | undefined> {
  let sendToParam = address ? `&send_object_to=${address}` : "";
  let epochs = numEpochs < 2 ? 2 : numEpochs;
  console.log("Writing to Walrus");
  console.time("written");
  const response = await fetch(
    `${basePublisherUrl}/v1/blobs?epochs=${epochs}${sendToParam}`,
    {
      method: "PUT",
      body: data,
    }
  );
  console.timeEnd("written");
  if (response.status === 200) {
    const info = await response.json();
    //console.log("info", info);
    const blobId =
      info?.newlyCreated?.blobObject?.blobId ?? info?.alreadyCertified?.blobId;
    console.log("Walrus blobId", blobId);
    return blobId;
  } else {
    console.error("saveToDA failed:", {
      statusText: response.statusText,
      status: response.status,
    });
    return undefined;
  }
}

export async function readFromWalrus({
  blobId,
}: {
  blobId: string;
}): Promise<string | undefined> {
  if (!blobId) {
    throw new Error("blobId is not provided");
  }
  console.log("Reading walrus blob", blobId);
  console.time("read");
  const response = await fetch(`${readerUrl}${blobId}`);
  console.timeEnd("read");
  if (!response.ok) {
    console.error("readFromDA failed:", {
      statusText: response.statusText,
      status: response.status,
    });
    return undefined;
  } else {
    const blob = await response.text();
    //console.log("blob", blob);
    return blob;
  }
}

export async function getWalrusUrl(params: {
  blobId: string;
}): Promise<string> {
  const { blobId } = params;
  if (!blobId) {
    throw new Error("blobId is not set");
  }
  const url = `${readerUrl}${blobId}`;
  return url;
}
