"use server";

export async function agentProve() {
  //return;
  console.log("agent: starting prove");
  const answer = await dexProverRequest({ task: "prove" });
  return answer;
}
export async function agentMerge() {
  //return;
  console.log("agent: starting merge");
  const answer = await dexProverRequest({
    task: "merge",
    metadata: "merge proofs",
  });
  return answer;
}
export async function agentSettle() {
  console.log("agent: starting settle");
  const answer = await dexProverRequest({
    task: "settle",
    metadata: "settle zk rollup state",
  });
  return answer;
}

export async function agentProveAccount(params: {
  address: string;
  blockNumber: number;
  sequence: number;
  sqlId?: number;
}) {
  console.log("agent: starting prove account");
  const args = JSON.stringify(params);

  const answer = await dexProverRequest({
    task: "proveAccount",
    metadata: `prove account`,
    args,
  });
  return answer;
}

export async function agentSqlRequest(params: {
  query: string;
  blockNumber: number;
  sequence: number;
}): Promise<{
  success: boolean;
  queryResult?: object;
  processedResult?: object;
  error?: string;
}> {
  console.log("agent: starting sql request");
  const args = JSON.stringify(params);

  const answer = await dexProverRequest({
    task: "sqlRequest",
    metadata: `SQL request`,
    args,
    mode: "sync",
  });
  //console.log("agent: sql request answer", answer);
  if (answer?.success !== true || !answer?.result) {
    return {
      success: false,
      error: answer?.error ?? "SQL request error E005",
    };
  }
  try {
    const result = JSON.parse(answer.result);
    console.log("agent: sql request result", result);
    if (
      result?.success !== true ||
      !result?.result?.query ||
      !result?.result?.processed
    ) {
      return {
        success: false,
        error:
          result.error ?? result?.result?.error ?? "SQL request error E006",
      };
    }
    const queryResult = JSON.parse(result?.result?.query);
    const processedResult = JSON.parse(result?.result?.processed);
    if (queryResult?.success !== true || !queryResult?.data) {
      return {
        success: false,
        error:
          result.error ?? result?.result?.error ?? "SQL request error E007",
      };
    }
    return {
      success: true,
      queryResult: queryResult.data,
      processedResult: processedResult,
    };
  } catch (error) {
    return {
      success: false,
      error: "SQL answer data parse error E008",
    };
  }
}

export async function agentSqlProcessing() {
  console.log("agent: starting sql processing");

  const answer = await dexProverRequest({
    task: "sqlProcessing",
    metadata: `SQL processing`,
  });
  return answer;
}

export async function agentMonitor(params: { blockNumber: number }) {
  console.log("agent: starting monitor");
  const answer = await dexProverRequest({
    task: "monitor",
    metadata: `monitor block ${params.blockNumber}`,
    args: JSON.stringify({
      blockNumber: params.blockNumber,
      task: "monitor",
    }),
  });
  return answer;
}

async function dexProverRequest(params: {
  task:
    | "prove"
    | "merge"
    | "settle"
    | "monitor"
    | "proveAccount"
    | "sqlRequest"
    | "sqlProcessing"
    | "metadata";
  metadata?: string;
  args?: string;
  mode?: "async" | "sync";
  command?: string;
}) {
  const chain = process.env.NEXT_PUBLIC_MINA_CHAIN || process.env.MINA_CHAIN;
  if (!chain) {
    throw new Error("MINA_CHAIN is not set");
  }
  if (chain !== "devnet" && chain !== "zeko" && chain !== "mainet") {
    throw new Error("MINA_CHAIN is not valid");
  }
  const { task, metadata = task, args, mode, command } = params;
  const answer = await silvanaProverRequest({
    command: command ?? "execute",
    developer: "DFST",
    repo: "dex-agent",
    transactions: [],
    task,
    args: args ?? JSON.stringify({ task }),
    metadata,
    chain,
    mode,
  });
  return answer;
}

export async function dexProverResult(params: { jobId: string }) {
  const chain = process.env.NEXT_PUBLIC_MINA_CHAIN || process.env.MINA_CHAIN;
  if (!chain) {
    throw new Error("MINA_CHAIN is not set");
  }
  if (chain !== "devnet" && chain !== "zeko" && chain !== "mainet") {
    throw new Error("MINA_CHAIN is not valid");
  }
  const { jobId } = params;
  const answer = await silvanaProverRequest({
    command: "jobResult",
    developer: "DFST",
    repo: "dex-agent",
    transactions: [],
    jobId,
    chain,
  });
  return answer;
}

export async function agentMetadata(params: {
  txId?: string;
  metadata: object;
  jobId: string;
  result: string;
  timeFinished: number;
  timeCreated: number;
  description: string;
}) {
  const chain = process.env.NEXT_PUBLIC_MINA_CHAIN || process.env.MINA_CHAIN;
  if (!chain) {
    throw new Error("MINA_CHAIN is not set");
  }
  if (chain !== "devnet" && chain !== "zeko" && chain !== "mainet") {
    throw new Error("MINA_CHAIN is not valid");
  }
  const answer = await silvanaProverRequest({
    command: "metadata",
    data: { ...params, developer: "DFST", repo: "dex-agent" },
    transactions: [],
    developer: "DFST",
    repo: "dex-agent",
    jobId: params.jobId,
    chain,
  });
  return answer;
}

export async function silvanaProverRequest(params: {
  command: string;
  data?: object;
  task?: string;
  transactions?: string[];
  args?: string;
  metadata?: string;
  mode?: "async" | "sync";
  jobId?: string;
  developer: string;
  repo: string;
  chain: "devnet" | "zeko" | "mainet";
}) {
  try {
    const JWT = process.env.JWT;
    if (!JWT) {
      throw new Error("Silvana zkProverJWT is not set");
    }
    const {
      command,
      task,
      transactions,
      args,
      metadata,
      mode,
      jobId,
      developer,
      repo,
      chain,
      data,
    } = params;
    const apiData = {
      auth: "M6t4jtbBAFFXhLERHQWyEB9JA9xi4cWqmYduaCXtbrFjb7yaY7TyaXDunKDJNiUTBEcyUomNXJgC",
      command: command,
      jwtToken: JWT,
      data: data ?? {
        task,
        transactions: transactions ?? [],
        args: args ?? "",
        repo: repo,
        developer: developer,
        metadata,
        mode,
        jobId,
      },
      chain,
      mode: mode ?? "async",
    };
    const endpoint = `https://api.zkcloudworker.com/v1/${chain}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${endpoint}`);
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error in silvanaProverRequest", error.message);
  }
}
