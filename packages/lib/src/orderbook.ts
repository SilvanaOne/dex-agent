import { DexObject, Orderbook, Deal } from "./types.js";

export function getOrderbook(dex: DexObject): Orderbook {
  // Initialize result objects
  const sorted_bids: Record<string, { amount: bigint; total: bigint }> = {};
  const sorted_offers: Record<string, { amount: bigint; total: bigint }> = {};

  // Group bids by price and calculate totals
  const bidsByPrice = new Map<bigint, bigint>();
  for (const [_, bid] of Object.entries(dex.bids)) {
    const current = bidsByPrice.get(bid.price) || 0n;
    bidsByPrice.set(bid.price, current + bid.amount);
  }

  // Group offers by price and calculate totals
  const offersByPrice = new Map<bigint, bigint>();
  for (const [_, offer] of Object.entries(dex.offers)) {
    const current = offersByPrice.get(offer.price) || 0n;
    offersByPrice.set(offer.price, current + offer.amount);
  }

  // Sort bids by price (descending) and calculate running total
  let runningBidTotal = 0n;
  const sortedBidPrices = Array.from(bidsByPrice.entries()).sort(
    ([priceA], [priceB]) => {
      // Sort by amount descending using BigInt comparison
      return priceB > priceA ? 1 : priceB < priceA ? -1 : 0;
    }
  );

  for (const [price, amount] of sortedBidPrices) {
    runningBidTotal += amount;
    sorted_bids[price.toString()] = {
      amount,
      total: runningBidTotal,
    };
  }

  // Sort offers by price (ascending) and calculate running total
  let runningAskTotal = 0n;
  const sortedOfferPrices = Array.from(offersByPrice.entries()).sort(
    ([priceA], [priceB]) => {
      // Sort by price ascending using BigInt comparison
      return priceA > priceB ? 1 : priceA < priceB ? -1 : 0;
    }
  );

  for (const [price, amount] of sortedOfferPrices) {
    runningAskTotal += amount;
    sorted_offers[price.toString()] = {
      amount,
      total: runningAskTotal,
    };
  }

  // Calculate highest bid and lowest offer
  let highest_bid: bigint | undefined = undefined;
  let lowest_offer: bigint | undefined = undefined;

  if (sortedBidPrices.length > 0) {
    highest_bid = sortedBidPrices[0][0]; // First element has the highest price
  }

  if (sortedOfferPrices.length > 0) {
    lowest_offer = sortedOfferPrices[0][0]; // First element has the lowest price
  }

  return {
    sorted_bids,
    sorted_offers,
    last_price: dex.last_price,
    total_bid_amount: runningBidTotal,
    total_ask_amount: runningAskTotal,
    highest_bid,
    lowest_offer,
  };
}

export function findUserDeal(params: {
  dex: DexObject;
  userPublicKey: string;
}): Deal | undefined {
  const { dex, userPublicKey } = params;
  const bids = dex.bids;
  const offers = dex.offers;
  const userBid = bids[userPublicKey];
  const userOffer = offers[userPublicKey];

  // If user has no active orders, return undefined
  if (!userBid && !userOffer) {
    return undefined;
  }

  // If user has a bid, look for matching offers
  if (userBid) {
    const matchingOffers = Object.entries(offers)
      .filter(([offerKey, offer]) => {
        // Don't match with user's own offers
        if (offerKey === userPublicKey) return false;
        // Match if offer price is <= bid price
        return offer.price <= userBid.price;
      })
      .sort(([, offerA], [, offerB]) => {
        // Sort by amount descending using BigInt comparison
        return offerB.amount > offerA.amount
          ? 1
          : offerB.amount < offerA.amount
          ? -1
          : 0;
      });

    if (matchingOffers.length > 0) {
      const [sellerKey, bestOffer] = matchingOffers[0];
      const baseTokenAmount =
        userBid.amount < bestOffer.amount ? userBid.amount : bestOffer.amount;
      const quoteTokenAmount =
        (baseTokenAmount * bestOffer.price) / 1_000_000_000n;

      return {
        buyerPublicKey: userPublicKey,
        sellerPublicKey: sellerKey,
        baseTokenAmount,
        quoteTokenAmount,
      };
    }
  }

  // If user has an offer, look for matching bids
  if (userOffer) {
    const matchingBids = Object.entries(bids)
      .filter(([bidKey, bid]) => {
        // Don't match with user's own bids
        if (bidKey === userPublicKey) return false;
        // Match if bid price is >= offer price
        return bid.price >= userOffer.price;
      })
      .sort(([, bidA], [, bidB]) => {
        // Sort by amount descending using BigInt comparison
        return bidB.amount > bidA.amount
          ? 1
          : bidB.amount < bidA.amount
          ? -1
          : 0;
      });

    if (matchingBids.length > 0) {
      const [buyerKey, bestBid] = matchingBids[0];
      const baseTokenAmount =
        userOffer.amount < bestBid.amount ? userOffer.amount : bestBid.amount;
      const quoteTokenAmount =
        (baseTokenAmount * userOffer.price) / 1_000_000_000n;

      return {
        buyerPublicKey: buyerKey,
        sellerPublicKey: userPublicKey,
        baseTokenAmount,
        quoteTokenAmount,
      };
    }
  }

  return undefined;
}

export function findDeal({
  dex,
  orderbook,
}: {
  dex: DexObject;
  orderbook: Orderbook;
}): Deal | undefined {
  if (!orderbook.highest_bid || !orderbook.lowest_offer) {
    return undefined;
  }

  // Find all possible matches where bid price >= offer price
  const matches: Array<{
    buyerKey: string;
    sellerKey: string;
    baseTokenAmount: bigint;
    bidPrice: bigint;
    offerPrice: bigint;
  }> = [];

  // Check all bid/offer combinations
  for (const [buyerKey, bid] of Object.entries(dex.bids)) {
    for (const [sellerKey, offer] of Object.entries(dex.offers)) {
      // Skip if buyer and seller are the same user
      if (buyerKey === sellerKey) {
        continue;
      }
      if (bid.price >= offer.price) {
        // Calculate the smaller of the two amounts
        const baseTokenAmount =
          bid.amount < offer.amount ? bid.amount : offer.amount;

        matches.push({
          buyerKey,
          sellerKey,
          baseTokenAmount,
          bidPrice: bid.price,
          offerPrice: offer.price,
        });
      }
    }
  }

  // If no matches found, return undefined
  if (matches.length === 0) {
    return undefined;
  }

  // Sort matches by amount (descending) to find the highest volume match
  matches.sort((a, b) =>
    a.baseTokenAmount > b.baseTokenAmount
      ? -1
      : a.baseTokenAmount < b.baseTokenAmount
      ? 1
      : 0
  );

  // Get the best match
  const bestMatch = matches[0];

  // Calculate average price between bid and offer
  const averagePrice = (bestMatch.bidPrice + bestMatch.offerPrice) / 2n;

  // Calculate quote token amount using average price
  const quoteTokenAmount =
    (bestMatch.baseTokenAmount * averagePrice) / 1_000_000_000n;

  return {
    buyerPublicKey: bestMatch.buyerKey,
    sellerPublicKey: bestMatch.sellerKey,
    baseTokenAmount: bestMatch.baseTokenAmount,
    quoteTokenAmount,
  };
}
