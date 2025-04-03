import { blockchain } from "@silvana-one/mina-utils";

export function processArguments(): {
  chain: blockchain;
  useLocalCloudWorker: boolean;
  noLog: boolean;
} {
  const chainName = process.env.CHAIN ?? "local";
  const noLog = process.env.NO_LOG ?? "false";
  const useLocalCloudWorker = process.env.CLOUD === "local";
  if (
    chainName !== "local" &&
    chainName !== "devnet" &&
    chainName !== "lightnet" &&
    chainName !== "zeko"
  )
    throw new Error("Invalid chain name");

  return {
    chain: chainName as blockchain,
    useLocalCloudWorker,
    noLog: noLog === "true",
  };
}
