"use server";
import { apiHandler } from "@/lib/api/api";
import { ApiName, ApiResponse } from "@/lib/api/api-types";

interface ConfigInput {
  version: "string";
}

interface ConfigOutput {
  chain: "sui";
  network: "devnet" | "testnet" | "mainnet";
  configId: string;
  versions: string[];
}

export default apiHandler<ConfigInput, ConfigOutput>({
  name: "config",
  handler: configHandler,
});

async function configHandler(props: {
  params: ConfigInput;
  name: ApiName;
}): Promise<ApiResponse<ConfigOutput>> {
  const configId = process.env.NEXT_PUBLIC_CONFIG_ID;
  console.log("configId", configId, props);

  if (!configId) {
    return {
      status: 500,
      json: { error: "Config ID is not set" },
    };
  }
  return {
    status: 200,
    json: {
      chain: "sui",
      network: "testnet",
      configId,
      versions: ["0.1.0"],
    },
  };
}
