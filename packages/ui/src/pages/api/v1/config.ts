"use server";
import { apiHandler } from "@/lib/api/api";
import { ApiName, ApiResponse } from "@/lib/api/api-types";

interface ConfigInput {
  version: "string";
}

interface ConfigOutput {
  configId: string;
}

export default apiHandler<ConfigInput, ConfigOutput>({
  name: "config",
  handler: configHandler,
});

export async function configHandler(props: {
  params: ConfigInput;
  name: ApiName;
}): Promise<ApiResponse<ConfigOutput>> {
  const configId = process.env.NEXT_PUBLIC_CONFIG_ID;
  if (!configId) {
    return {
      status: 500,
      json: { error: "Config ID is not set" },
    };
  }
  return {
    status: 200,
    json: {
      configId,
    },
  };
}
