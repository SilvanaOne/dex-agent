"use server";

export async function silvanaFaucet(params: {
  address: string;
  amount?: number;
}): Promise<{
  message: string;
  success: true;
  transaction_hash: string;
}> {
  const { address, amount } = params;
  const response = await fetch(`${silvanaFaucetEndpoint()}/fund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      amount: amount ?? 1,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fund address: ${address} ${amount} ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function silvanaFaucetGetKey(): Promise<{
  key_pair: {
    address: string;
    issued_at: string;
    private_key_bech32: string;
    private_key_hex: string;
    public_key: string;
  };
  message: string;
  success: true;
}> {
  const response = await fetch(`${silvanaFaucetEndpoint()}/get_key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get key: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function silvanaFaucetReturnKey(params: {
  address: string;
}): Promise<{
  message: string;
  success: true;
}> {
  const { address } = params;
  const response = await fetch(`${silvanaFaucetEndpoint()}/return_key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to return key: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

function silvanaFaucetEndpoint(): string {
  const silvanaFaucetEndpoint = process.env.SILVANA_FAUCET_ENDPOINT!;
  if (!silvanaFaucetEndpoint) {
    throw new Error("SILVANA_FAUCET_ENDPOINT is not set");
  }
  return silvanaFaucetEndpoint;
}
