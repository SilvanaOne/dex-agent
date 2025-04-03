import { describe, it } from "node:test";
import assert from "node:assert";
import { getEthPrice, getEthPriceHistory } from "../src/price";

describe("Price", async () => {
  it("should get eth price", async () => {
    const price = await getEthPrice();
    console.log(price);
  });
  it("should get eth price history", async () => {
    const priceHistory = await getEthPriceHistory();
    console.log(priceHistory);
  });
});
