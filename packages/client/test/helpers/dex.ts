import { Token, Pool, User, UserTradingAccount } from "@dex-agent/lib";
import { PrivateKey, TokenId } from "o1js";

export interface DexObjects {
  baseToken: Token;
  quoteToken: Token;
  pool: Pool;
  faucet: User;
  liquidityProvider: User;
  alice: User;
  bob: User;
}

export function createInitialState(): DexObjects {
  const baseToken = createToken({
    token: "DETH",
    name: "Wrapped ETH",
    description: "Wrapped ETH token on Mina",
    image: "https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png",
  });
  const quoteToken = createToken({
    token: "DUSD",
    name: "Wrapped USD",
    description: "Wrapped USD token on Mina",
    image: "https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png",
  });
  const pool = createPool({
    name: "Silvana DEX Pool ETH/USD",
    baseToken: baseToken,
    quoteToken: quoteToken,
  });
  const faucet = createUser({
    name: "Faucet",
    role: "Faucet",
    baseTokenBalance: 1_000_000_000_000_000n,
    quoteTokenBalance: 15_000_000_000_000_000_000n,
    image:
      "https://assets-global.website-files.com/636e894daa9e99940a604aef/655842da7e6e462fc433de1b_Crypto%20Faucet.webp",
    privateKey: process.env.MINA_FAUCET_PRIVATE_KEY,
  });
  const liquidityProvider = createUser({
    name: "Liquidity Provider",
    role: "Liquidity Provider",
    baseTokenBalance: 1_000_000_000_000_000n,
    quoteTokenBalance: 100_000_000_000_000_000n,
    image:
      "https://www.start-business-online.com/media/articles/role-liquitidy-provider.jpg",
  });
  const alice = createUser({
    name: "Alice",
    image:
      "https://www.publicdomainpictures.net/pictures/600000/velka/alice-in-wonderland-1711694002aRI.jpg",
    privateKey: process.env.ALICE_PRIVATE_KEY,
  });
  const bob = createUser({
    name: "Bob",
    image:
      "https://4.bp.blogspot.com/-mgXX1j4845c/U1Bj1pl71PI/AAAAAAAAyok/wbyMBWafDS8/s1600/White_rabbit_clip_art_2.jpg",
  });
  return {
    baseToken,
    quoteToken,
    pool,
    faucet,
    liquidityProvider,
    alice,
    bob,
  };
}

export function createToken(params: {
  token: string;
  name: string;
  description: string;
  image?: string;
  privateKey?: string;
}): Token {
  const { token, name, description, image = "" } = params;
  const privateKey = params.privateKey
    ? PrivateKey.fromBase58(params.privateKey)
    : PrivateKey.random();
  const publicKey = privateKey.toPublicKey();
  const tokenId = TokenId.derive(publicKey);
  return {
    name,
    description,
    image,
    suiAddress: "",
    minaPublicKey: publicKey.toBase58(),
    minaPrivateKey: privateKey.toBase58(),
    tokenId: TokenId.toBase58(tokenId),
    token,
  };
}

export function createPool(params: {
  name: string;
  baseToken: Token;
  quoteToken: Token;
}): Pool {
  const { name, baseToken, quoteToken } = params;
  const privateKey = PrivateKey.random();
  const publicKey = privateKey.toPublicKey();
  return {
    name,
    baseTokenId: baseToken.tokenId,
    quoteTokenId: quoteToken.tokenId,
    suiAddress: "",
    minaPublicKey: publicKey.toBase58(),
    minaPrivateKey: privateKey.toBase58(),
    accounts: {},
    lastPrice: 2000n,
  };
}

export function createUser(params: {
  name?: string;
  image?: string;
  role?: "Faucet" | "Liquidity Provider" | "User";
  baseTokenBalance?: bigint;
  quoteTokenBalance?: bigint;
  privateKey?: string;
}): User {
  const {
    name,
    image = "",
    role = "User",
    baseTokenBalance,
    quoteTokenBalance,
  } = params;
  const privateKey = params.privateKey
    ? PrivateKey.fromBase58(params.privateKey)
    : PrivateKey.random();
  const publicKey = privateKey.toPublicKey();
  return {
    name: name ?? publicKey.toBase58(),
    image,
    suiAddress: "",
    minaPublicKey: publicKey.toBase58(),
    minaPrivateKey: privateKey.toBase58(),
    role,
    account: createUserTradingAccount({ baseTokenBalance, quoteTokenBalance }),
  };
}

export function createUserTradingAccount(params: {
  baseTokenBalance?: bigint;
  quoteTokenBalance?: bigint;
}): UserTradingAccount {
  return {
    baseTokenBalance: {
      amount: params.baseTokenBalance ?? 0n,
      stakedAmount: 0n,
      borrowedAmount: 0n,
    },
    quoteTokenBalance: {
      amount: params.quoteTokenBalance ?? 0n,
      stakedAmount: 0n,
      borrowedAmount: 0n,
    },
    bid: {
      amount: 0n,
      price: 0n,
      isSome: false,
    },
    ask: {
      amount: 0n,
      price: 0n,
      isSome: false,
    },
    nonce: 0n,
  };
}
