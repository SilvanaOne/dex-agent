
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/library.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.StateScalarFieldEnum = {
  sequence: 'sequence',
  address: 'address',
  baseTokenAmount: 'baseTokenAmount',
  baseTokenStakedAmount: 'baseTokenStakedAmount',
  baseTokenBorrowedAmount: 'baseTokenBorrowedAmount',
  quoteTokenAmount: 'quoteTokenAmount',
  quoteTokenStakedAmount: 'quoteTokenStakedAmount',
  quoteTokenBorrowedAmount: 'quoteTokenBorrowedAmount',
  bidAmount: 'bidAmount',
  bidPrice: 'bidPrice',
  bidIsSome: 'bidIsSome',
  askAmount: 'askAmount',
  askPrice: 'askPrice',
  askIsSome: 'askIsSome',
  nonce: 'nonce'
};

exports.Prisma.FetchedSequencesScalarFieldEnum = {
  sequence: 'sequence'
};

exports.Prisma.ActionRequestScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  operation: 'operation',
  status: 'status',
  address: 'address',
  poolPublicKey: 'poolPublicKey',
  publicKey: 'publicKey',
  publicKeyBase58: 'publicKeyBase58',
  name: 'name',
  role: 'role',
  image: 'image',
  baseBalance: 'baseBalance',
  quoteBalance: 'quoteBalance',
  userPublicKey: 'userPublicKey',
  baseTokenAmount: 'baseTokenAmount',
  price: 'price',
  isSome: 'isSome',
  nonce: 'nonce',
  userSignatureR: 'userSignatureR',
  userSignatureS: 'userSignatureS',
  buyerPublicKey: 'buyerPublicKey',
  sellerPublicKey: 'sellerPublicKey',
  quoteTokenAmount: 'quoteTokenAmount',
  buyerNonce: 'buyerNonce',
  sellerNonce: 'sellerNonce',
  senderPublicKey: 'senderPublicKey',
  receiverPublicKey: 'receiverPublicKey',
  senderNonce: 'senderNonce',
  receiverNonce: 'receiverNonce',
  senderSignatureR: 'senderSignatureR',
  senderSignatureS: 'senderSignatureS',
  sequence: 'sequence',
  agent: 'agent',
  digest: 'digest',
  da_hash: 'da_hash'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Operation = exports.$Enums.Operation = {
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  BID: 'BID',
  ASK: 'ASK',
  TRADE: 'TRADE',
  TRANSFER: 'TRANSFER',
  PROOF: 'PROOF'
};

exports.ActionStatus = exports.$Enums.ActionStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
};

exports.Prisma.ModelName = {
  State: 'State',
  FetchedSequences: 'FetchedSequences',
  ActionRequest: 'ActionRequest'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/mike/Documents/Silvana/dex-agent/packages/lib/src/prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "/Users/mike/Documents/Silvana/dex-agent/packages/lib/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "../../prisma",
  "clientVersion": "6.6.0",
  "engineVersion": "f676762280b54cd07c770017ed3711ddde35f37a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "SILVANA_DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"../src/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"SILVANA_DATABASE_URL\")\n}\n\nmodel State {\n  sequence BigInt\n  address  String\n\n  baseTokenAmount         Decimal @db.Decimal(precision: 80, scale: 0)\n  baseTokenStakedAmount   Decimal @db.Decimal(precision: 80, scale: 0)\n  baseTokenBorrowedAmount Decimal @db.Decimal(precision: 80, scale: 0)\n\n  quoteTokenAmount         Decimal @db.Decimal(precision: 80, scale: 0)\n  quoteTokenStakedAmount   Decimal @db.Decimal(precision: 80, scale: 0)\n  quoteTokenBorrowedAmount Decimal @db.Decimal(precision: 80, scale: 0)\n\n  bidAmount Decimal @db.Decimal(precision: 80, scale: 0)\n  bidPrice  Decimal @db.Decimal(precision: 80, scale: 0)\n  bidIsSome Boolean\n\n  askAmount Decimal @db.Decimal(precision: 80, scale: 0)\n  askPrice  Decimal @db.Decimal(precision: 80, scale: 0)\n  askIsSome Boolean\n\n  nonce Decimal @db.Decimal(precision: 80, scale: 0)\n\n  @@id([sequence, address])\n  @@index([sequence])\n  @@index([address])\n}\n\nmodel FetchedSequences {\n  sequence BigInt @id\n}\n\nenum Operation {\n  CREATE_ACCOUNT\n  BID\n  ASK\n  TRADE\n  TRANSFER\n  PROOF\n}\n\nenum ActionStatus {\n  PENDING\n  PROCESSING\n  SUCCESS\n  FAILED\n}\n\nmodel ActionRequest {\n  id        Int          @id @default(autoincrement())\n  createdAt DateTime     @default(now())\n  operation Operation\n  status    ActionStatus @default(PENDING)\n\n  // CREATE_ACCOUNT fields\n  address         String?\n  poolPublicKey   String?\n  publicKey       String?\n  publicKeyBase58 String?\n  name            String?\n  role            String?\n  image           String?\n  baseBalance     Decimal? @db.Decimal(precision: 80, scale: 0)\n  quoteBalance    Decimal? @db.Decimal(precision: 80, scale: 0)\n\n  // BID/ASK fields\n  userPublicKey   String?\n  baseTokenAmount Decimal? @db.Decimal(precision: 80, scale: 0)\n  price           Decimal? @db.Decimal(precision: 80, scale: 0)\n  isSome          Boolean?\n  nonce           Decimal? @db.Decimal(precision: 80, scale: 0)\n  userSignatureR  Decimal? @db.Decimal(precision: 80, scale: 0)\n  userSignatureS  Decimal? @db.Decimal(precision: 80, scale: 0)\n\n  // TRADE fields\n  buyerPublicKey   String?\n  sellerPublicKey  String?\n  quoteTokenAmount Decimal? @db.Decimal(precision: 80, scale: 0)\n  buyerNonce       Decimal? @db.Decimal(precision: 80, scale: 0)\n  sellerNonce      Decimal? @db.Decimal(precision: 80, scale: 0)\n\n  // TRANSFER fields\n  senderPublicKey   String?\n  receiverPublicKey String?\n  senderNonce       Decimal? @db.Decimal(precision: 80, scale: 0)\n  receiverNonce     Decimal? @db.Decimal(precision: 80, scale: 0)\n  senderSignatureR  Decimal? @db.Decimal(precision: 80, scale: 0)\n  senderSignatureS  Decimal? @db.Decimal(precision: 80, scale: 0)\n\n  // PROOF fields\n  sequence Decimal? @db.Decimal(precision: 80, scale: 0)\n  //publicKeyBase58   String?\n\n  // PROCESSING AGENT ID\n  agent String?\n\n  // RESULT OF REQUEST\n  digest  String?\n  da_hash String?\n\n  @@index([operation])\n  @@index([status])\n}\n",
  "inlineSchemaHash": "55645c60683abeedf5bd521b446b184b991befa513569a5fa019f5c80c960413",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "src/prisma",
    "prisma",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"State\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"sequence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BigInt\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseTokenAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseTokenStakedAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseTokenBorrowedAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quoteTokenAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quoteTokenStakedAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quoteTokenBorrowedAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bidAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bidPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bidIsSome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"askAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"askPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"askIsSome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nonce\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"sequence\",\"address\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FetchedSequences\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"sequence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BigInt\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ActionRequest\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"operation\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Operation\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ActionStatus\",\"nativeType\":null,\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"poolPublicKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"publicKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"publicKeyBase58\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"image\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseBalance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quoteBalance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userPublicKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseTokenAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isSome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nonce\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userSignatureR\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userSignatureS\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"buyerPublicKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sellerPublicKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quoteTokenAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"buyerNonce\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sellerNonce\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"senderPublicKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiverPublicKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"senderNonce\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiverNonce\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"senderSignatureR\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"senderSignatureS\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sequence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"nativeType\":[\"Decimal\",[\"80\",\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"digest\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"da_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"Operation\":{\"values\":[{\"name\":\"CREATE_ACCOUNT\",\"dbName\":null},{\"name\":\"BID\",\"dbName\":null},{\"name\":\"ASK\",\"dbName\":null},{\"name\":\"TRADE\",\"dbName\":null},{\"name\":\"TRANSFER\",\"dbName\":null},{\"name\":\"PROOF\",\"dbName\":null}],\"dbName\":null},\"ActionStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PROCESSING\",\"dbName\":null},{\"name\":\"SUCCESS\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined
config.compilerWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "libquery_engine-darwin-arm64.dylib.node");
path.join(process.cwd(), "src/prisma/libquery_engine-darwin-arm64.dylib.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "src/prisma/schema.prisma")
