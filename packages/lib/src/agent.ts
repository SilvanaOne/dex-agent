"use server";

export async function agentProve() {
  console.log("agent: starting prove");
  const answer = await dexProverRequest({ task: "prove" });
  return answer;
}
export async function agentMerge() {
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
  task: "prove" | "merge" | "settle" | "monitor";
  metadata?: string;
  args?: string;
}) {
  const chain = process.env.NEXT_PUBLIC_MINA_CHAIN || process.env.MINA_CHAIN;
  if (!chain) {
    throw new Error("MINA_CHAIN is not set");
  }
  if (chain !== "devnet" && chain !== "zeko" && chain !== "mainet") {
    throw new Error("MINA_CHAIN is not valid");
  }
  const { task, metadata = task, args } = params;
  const answer = await silvanaProverRequest({
    command: "execute",
    developer: "DFST",
    repo: "dex-agent",
    transactions: [],
    task,
    args: args ?? JSON.stringify({ task }),
    metadata,
    chain,
  });
  return answer;
}

export async function silvanaProverRequest(params: {
  command: string;
  task?: string;
  transactions?: string[];
  args?: string;
  metadata?: string;
  mode?: string;
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
    } = params;
    const apiData = {
      auth: "M6t4jtbBAFFXhLERHQWyEB9JA9xi4cWqmYduaCXtbrFjb7yaY7TyaXDunKDJNiUTBEcyUomNXJgC",
      command: command,
      jwtToken: JWT,
      data: {
        task,
        transactions: transactions ?? [],
        args: args ?? "",
        repo: repo,
        developer: developer,
        metadata,
        mode,
        jobId,
      },
      chain: `devnet`,
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
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error in silvanaProverRequest", error.message);
  }
}
