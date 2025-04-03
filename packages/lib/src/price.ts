// https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd

export async function getEthPrice(): Promise<
  | {
      price: number;
      change: number;
    }
  | undefined
> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true`
    );
    const data = await response.json();
    return {
      price: data?.ethereum?.usd,
      change: data?.ethereum?.usd_24h_change,
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

// https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1
export async function getEthPriceHistory(): Promise<
  | {
      prices: number[][];
    }
  | undefined
> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1`
    );
    const data = await response.json();
    return {
      prices: data?.prices,
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
