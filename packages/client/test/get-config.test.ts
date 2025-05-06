import { describe, it } from "node:test";
import assert from "node:assert";

describe("Get Config ID", async () => {
  it("should get config id", async () => {
    const config = await fetch("https://dex.silvana.dev/api/v1/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "0.1.0",
      }),
    });
    if (!config.ok) {
      console.error("Cannot get config", config.status, config.statusText);
    } else {
      const configData = await config.json();
      console.log(configData);
      console.log(configData?.configId);
      assert.ok(configData, "config is not set");
    }
  });
});
