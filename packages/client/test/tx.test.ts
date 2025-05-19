import { describe, it } from "node:test";
import assert from "node:assert";
import { getFullnodeUrl, SuiClient, SuiEvent } from "@mysten/sui/client";

const suiClient = new SuiClient({
  url: getFullnodeUrl("devnet"),
});

describe("Get tx data", async () => {
  it("should get tx data", async () => {
    const tx = await suiClient.getTransactionBlock({
      digest: "89VRzaj3gRmvR1Mf7xQ8hsDUBEZpJjjM7mvcUMzMHe7u",
    });
    console.log(tx);
    const txTime = tx.timestampMs;
    console.log("unix time:", txTime);
    const txTimeDate = new Date(Number(txTime));
    console.log("date:", txTimeDate);
  });
});
