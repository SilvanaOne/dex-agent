
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model State
 * 
 */
export type State = $Result.DefaultSelection<Prisma.$StatePayload>
/**
 * Model FetchedSequences
 * 
 */
export type FetchedSequences = $Result.DefaultSelection<Prisma.$FetchedSequencesPayload>
/**
 * Model ActionRequest
 * 
 */
export type ActionRequest = $Result.DefaultSelection<Prisma.$ActionRequestPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Operation: {
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  BID: 'BID',
  ASK: 'ASK',
  TRADE: 'TRADE',
  TRANSFER: 'TRANSFER'
};

export type Operation = (typeof Operation)[keyof typeof Operation]


export const ActionStatus: {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
};

export type ActionStatus = (typeof ActionStatus)[keyof typeof ActionStatus]

}

export type Operation = $Enums.Operation

export const Operation: typeof $Enums.Operation

export type ActionStatus = $Enums.ActionStatus

export const ActionStatus: typeof $Enums.ActionStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more States
 * const states = await prisma.state.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more States
   * const states = await prisma.state.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.state`: Exposes CRUD operations for the **State** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more States
    * const states = await prisma.state.findMany()
    * ```
    */
  get state(): Prisma.StateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fetchedSequences`: Exposes CRUD operations for the **FetchedSequences** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FetchedSequences
    * const fetchedSequences = await prisma.fetchedSequences.findMany()
    * ```
    */
  get fetchedSequences(): Prisma.FetchedSequencesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.actionRequest`: Exposes CRUD operations for the **ActionRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActionRequests
    * const actionRequests = await prisma.actionRequest.findMany()
    * ```
    */
  get actionRequest(): Prisma.ActionRequestDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    State: 'State',
    FetchedSequences: 'FetchedSequences',
    ActionRequest: 'ActionRequest'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "state" | "fetchedSequences" | "actionRequest"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      State: {
        payload: Prisma.$StatePayload<ExtArgs>
        fields: Prisma.StateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          findFirst: {
            args: Prisma.StateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          findMany: {
            args: Prisma.StateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>[]
          }
          create: {
            args: Prisma.StateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          createMany: {
            args: Prisma.StateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>[]
          }
          delete: {
            args: Prisma.StateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          update: {
            args: Prisma.StateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          deleteMany: {
            args: Prisma.StateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>[]
          }
          upsert: {
            args: Prisma.StateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatePayload>
          }
          aggregate: {
            args: Prisma.StateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateState>
          }
          groupBy: {
            args: Prisma.StateGroupByArgs<ExtArgs>
            result: $Utils.Optional<StateGroupByOutputType>[]
          }
          count: {
            args: Prisma.StateCountArgs<ExtArgs>
            result: $Utils.Optional<StateCountAggregateOutputType> | number
          }
        }
      }
      FetchedSequences: {
        payload: Prisma.$FetchedSequencesPayload<ExtArgs>
        fields: Prisma.FetchedSequencesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FetchedSequencesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FetchedSequencesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload>
          }
          findFirst: {
            args: Prisma.FetchedSequencesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FetchedSequencesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload>
          }
          findMany: {
            args: Prisma.FetchedSequencesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload>[]
          }
          create: {
            args: Prisma.FetchedSequencesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload>
          }
          createMany: {
            args: Prisma.FetchedSequencesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FetchedSequencesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload>[]
          }
          delete: {
            args: Prisma.FetchedSequencesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload>
          }
          update: {
            args: Prisma.FetchedSequencesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload>
          }
          deleteMany: {
            args: Prisma.FetchedSequencesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FetchedSequencesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FetchedSequencesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload>[]
          }
          upsert: {
            args: Prisma.FetchedSequencesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FetchedSequencesPayload>
          }
          aggregate: {
            args: Prisma.FetchedSequencesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFetchedSequences>
          }
          groupBy: {
            args: Prisma.FetchedSequencesGroupByArgs<ExtArgs>
            result: $Utils.Optional<FetchedSequencesGroupByOutputType>[]
          }
          count: {
            args: Prisma.FetchedSequencesCountArgs<ExtArgs>
            result: $Utils.Optional<FetchedSequencesCountAggregateOutputType> | number
          }
        }
      }
      ActionRequest: {
        payload: Prisma.$ActionRequestPayload<ExtArgs>
        fields: Prisma.ActionRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActionRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActionRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload>
          }
          findFirst: {
            args: Prisma.ActionRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActionRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload>
          }
          findMany: {
            args: Prisma.ActionRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload>[]
          }
          create: {
            args: Prisma.ActionRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload>
          }
          createMany: {
            args: Prisma.ActionRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActionRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload>[]
          }
          delete: {
            args: Prisma.ActionRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload>
          }
          update: {
            args: Prisma.ActionRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload>
          }
          deleteMany: {
            args: Prisma.ActionRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActionRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ActionRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload>[]
          }
          upsert: {
            args: Prisma.ActionRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionRequestPayload>
          }
          aggregate: {
            args: Prisma.ActionRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActionRequest>
          }
          groupBy: {
            args: Prisma.ActionRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActionRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActionRequestCountArgs<ExtArgs>
            result: $Utils.Optional<ActionRequestCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    state?: StateOmit
    fetchedSequences?: FetchedSequencesOmit
    actionRequest?: ActionRequestOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model State
   */

  export type AggregateState = {
    _count: StateCountAggregateOutputType | null
    _avg: StateAvgAggregateOutputType | null
    _sum: StateSumAggregateOutputType | null
    _min: StateMinAggregateOutputType | null
    _max: StateMaxAggregateOutputType | null
  }

  export type StateAvgAggregateOutputType = {
    sequence: number | null
    baseTokenAmount: number | null
    baseTokenStakedAmount: number | null
    baseTokenBorrowedAmount: number | null
    quoteTokenAmount: number | null
    quoteTokenStakedAmount: number | null
    quoteTokenBorrowedAmount: number | null
    bidAmount: number | null
    bidPrice: number | null
    askAmount: number | null
    askPrice: number | null
    nonce: number | null
  }

  export type StateSumAggregateOutputType = {
    sequence: bigint | null
    baseTokenAmount: bigint | null
    baseTokenStakedAmount: bigint | null
    baseTokenBorrowedAmount: bigint | null
    quoteTokenAmount: bigint | null
    quoteTokenStakedAmount: bigint | null
    quoteTokenBorrowedAmount: bigint | null
    bidAmount: bigint | null
    bidPrice: bigint | null
    askAmount: bigint | null
    askPrice: bigint | null
    nonce: bigint | null
  }

  export type StateMinAggregateOutputType = {
    sequence: bigint | null
    address: string | null
    baseTokenAmount: bigint | null
    baseTokenStakedAmount: bigint | null
    baseTokenBorrowedAmount: bigint | null
    quoteTokenAmount: bigint | null
    quoteTokenStakedAmount: bigint | null
    quoteTokenBorrowedAmount: bigint | null
    bidAmount: bigint | null
    bidPrice: bigint | null
    bidIsSome: boolean | null
    askAmount: bigint | null
    askPrice: bigint | null
    askIsSome: boolean | null
    nonce: bigint | null
  }

  export type StateMaxAggregateOutputType = {
    sequence: bigint | null
    address: string | null
    baseTokenAmount: bigint | null
    baseTokenStakedAmount: bigint | null
    baseTokenBorrowedAmount: bigint | null
    quoteTokenAmount: bigint | null
    quoteTokenStakedAmount: bigint | null
    quoteTokenBorrowedAmount: bigint | null
    bidAmount: bigint | null
    bidPrice: bigint | null
    bidIsSome: boolean | null
    askAmount: bigint | null
    askPrice: bigint | null
    askIsSome: boolean | null
    nonce: bigint | null
  }

  export type StateCountAggregateOutputType = {
    sequence: number
    address: number
    baseTokenAmount: number
    baseTokenStakedAmount: number
    baseTokenBorrowedAmount: number
    quoteTokenAmount: number
    quoteTokenStakedAmount: number
    quoteTokenBorrowedAmount: number
    bidAmount: number
    bidPrice: number
    bidIsSome: number
    askAmount: number
    askPrice: number
    askIsSome: number
    nonce: number
    _all: number
  }


  export type StateAvgAggregateInputType = {
    sequence?: true
    baseTokenAmount?: true
    baseTokenStakedAmount?: true
    baseTokenBorrowedAmount?: true
    quoteTokenAmount?: true
    quoteTokenStakedAmount?: true
    quoteTokenBorrowedAmount?: true
    bidAmount?: true
    bidPrice?: true
    askAmount?: true
    askPrice?: true
    nonce?: true
  }

  export type StateSumAggregateInputType = {
    sequence?: true
    baseTokenAmount?: true
    baseTokenStakedAmount?: true
    baseTokenBorrowedAmount?: true
    quoteTokenAmount?: true
    quoteTokenStakedAmount?: true
    quoteTokenBorrowedAmount?: true
    bidAmount?: true
    bidPrice?: true
    askAmount?: true
    askPrice?: true
    nonce?: true
  }

  export type StateMinAggregateInputType = {
    sequence?: true
    address?: true
    baseTokenAmount?: true
    baseTokenStakedAmount?: true
    baseTokenBorrowedAmount?: true
    quoteTokenAmount?: true
    quoteTokenStakedAmount?: true
    quoteTokenBorrowedAmount?: true
    bidAmount?: true
    bidPrice?: true
    bidIsSome?: true
    askAmount?: true
    askPrice?: true
    askIsSome?: true
    nonce?: true
  }

  export type StateMaxAggregateInputType = {
    sequence?: true
    address?: true
    baseTokenAmount?: true
    baseTokenStakedAmount?: true
    baseTokenBorrowedAmount?: true
    quoteTokenAmount?: true
    quoteTokenStakedAmount?: true
    quoteTokenBorrowedAmount?: true
    bidAmount?: true
    bidPrice?: true
    bidIsSome?: true
    askAmount?: true
    askPrice?: true
    askIsSome?: true
    nonce?: true
  }

  export type StateCountAggregateInputType = {
    sequence?: true
    address?: true
    baseTokenAmount?: true
    baseTokenStakedAmount?: true
    baseTokenBorrowedAmount?: true
    quoteTokenAmount?: true
    quoteTokenStakedAmount?: true
    quoteTokenBorrowedAmount?: true
    bidAmount?: true
    bidPrice?: true
    bidIsSome?: true
    askAmount?: true
    askPrice?: true
    askIsSome?: true
    nonce?: true
    _all?: true
  }

  export type StateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which State to aggregate.
     */
    where?: StateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of States to fetch.
     */
    orderBy?: StateOrderByWithRelationInput | StateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` States from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` States.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned States
    **/
    _count?: true | StateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StateMaxAggregateInputType
  }

  export type GetStateAggregateType<T extends StateAggregateArgs> = {
        [P in keyof T & keyof AggregateState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateState[P]>
      : GetScalarType<T[P], AggregateState[P]>
  }




  export type StateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StateWhereInput
    orderBy?: StateOrderByWithAggregationInput | StateOrderByWithAggregationInput[]
    by: StateScalarFieldEnum[] | StateScalarFieldEnum
    having?: StateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StateCountAggregateInputType | true
    _avg?: StateAvgAggregateInputType
    _sum?: StateSumAggregateInputType
    _min?: StateMinAggregateInputType
    _max?: StateMaxAggregateInputType
  }

  export type StateGroupByOutputType = {
    sequence: bigint
    address: string
    baseTokenAmount: bigint
    baseTokenStakedAmount: bigint
    baseTokenBorrowedAmount: bigint
    quoteTokenAmount: bigint
    quoteTokenStakedAmount: bigint
    quoteTokenBorrowedAmount: bigint
    bidAmount: bigint
    bidPrice: bigint
    bidIsSome: boolean
    askAmount: bigint
    askPrice: bigint
    askIsSome: boolean
    nonce: bigint
    _count: StateCountAggregateOutputType | null
    _avg: StateAvgAggregateOutputType | null
    _sum: StateSumAggregateOutputType | null
    _min: StateMinAggregateOutputType | null
    _max: StateMaxAggregateOutputType | null
  }

  type GetStateGroupByPayload<T extends StateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StateGroupByOutputType[P]>
            : GetScalarType<T[P], StateGroupByOutputType[P]>
        }
      >
    >


  export type StateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sequence?: boolean
    address?: boolean
    baseTokenAmount?: boolean
    baseTokenStakedAmount?: boolean
    baseTokenBorrowedAmount?: boolean
    quoteTokenAmount?: boolean
    quoteTokenStakedAmount?: boolean
    quoteTokenBorrowedAmount?: boolean
    bidAmount?: boolean
    bidPrice?: boolean
    bidIsSome?: boolean
    askAmount?: boolean
    askPrice?: boolean
    askIsSome?: boolean
    nonce?: boolean
  }, ExtArgs["result"]["state"]>

  export type StateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sequence?: boolean
    address?: boolean
    baseTokenAmount?: boolean
    baseTokenStakedAmount?: boolean
    baseTokenBorrowedAmount?: boolean
    quoteTokenAmount?: boolean
    quoteTokenStakedAmount?: boolean
    quoteTokenBorrowedAmount?: boolean
    bidAmount?: boolean
    bidPrice?: boolean
    bidIsSome?: boolean
    askAmount?: boolean
    askPrice?: boolean
    askIsSome?: boolean
    nonce?: boolean
  }, ExtArgs["result"]["state"]>

  export type StateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sequence?: boolean
    address?: boolean
    baseTokenAmount?: boolean
    baseTokenStakedAmount?: boolean
    baseTokenBorrowedAmount?: boolean
    quoteTokenAmount?: boolean
    quoteTokenStakedAmount?: boolean
    quoteTokenBorrowedAmount?: boolean
    bidAmount?: boolean
    bidPrice?: boolean
    bidIsSome?: boolean
    askAmount?: boolean
    askPrice?: boolean
    askIsSome?: boolean
    nonce?: boolean
  }, ExtArgs["result"]["state"]>

  export type StateSelectScalar = {
    sequence?: boolean
    address?: boolean
    baseTokenAmount?: boolean
    baseTokenStakedAmount?: boolean
    baseTokenBorrowedAmount?: boolean
    quoteTokenAmount?: boolean
    quoteTokenStakedAmount?: boolean
    quoteTokenBorrowedAmount?: boolean
    bidAmount?: boolean
    bidPrice?: boolean
    bidIsSome?: boolean
    askAmount?: boolean
    askPrice?: boolean
    askIsSome?: boolean
    nonce?: boolean
  }

  export type StateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"sequence" | "address" | "baseTokenAmount" | "baseTokenStakedAmount" | "baseTokenBorrowedAmount" | "quoteTokenAmount" | "quoteTokenStakedAmount" | "quoteTokenBorrowedAmount" | "bidAmount" | "bidPrice" | "bidIsSome" | "askAmount" | "askPrice" | "askIsSome" | "nonce", ExtArgs["result"]["state"]>

  export type $StatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "State"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      sequence: bigint
      address: string
      baseTokenAmount: bigint
      baseTokenStakedAmount: bigint
      baseTokenBorrowedAmount: bigint
      quoteTokenAmount: bigint
      quoteTokenStakedAmount: bigint
      quoteTokenBorrowedAmount: bigint
      bidAmount: bigint
      bidPrice: bigint
      bidIsSome: boolean
      askAmount: bigint
      askPrice: bigint
      askIsSome: boolean
      nonce: bigint
    }, ExtArgs["result"]["state"]>
    composites: {}
  }

  type StateGetPayload<S extends boolean | null | undefined | StateDefaultArgs> = $Result.GetResult<Prisma.$StatePayload, S>

  type StateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StateCountAggregateInputType | true
    }

  export interface StateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['State'], meta: { name: 'State' } }
    /**
     * Find zero or one State that matches the filter.
     * @param {StateFindUniqueArgs} args - Arguments to find a State
     * @example
     * // Get one State
     * const state = await prisma.state.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StateFindUniqueArgs>(args: SelectSubset<T, StateFindUniqueArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one State that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StateFindUniqueOrThrowArgs} args - Arguments to find a State
     * @example
     * // Get one State
     * const state = await prisma.state.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StateFindUniqueOrThrowArgs>(args: SelectSubset<T, StateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first State that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateFindFirstArgs} args - Arguments to find a State
     * @example
     * // Get one State
     * const state = await prisma.state.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StateFindFirstArgs>(args?: SelectSubset<T, StateFindFirstArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first State that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateFindFirstOrThrowArgs} args - Arguments to find a State
     * @example
     * // Get one State
     * const state = await prisma.state.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StateFindFirstOrThrowArgs>(args?: SelectSubset<T, StateFindFirstOrThrowArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more States that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all States
     * const states = await prisma.state.findMany()
     * 
     * // Get first 10 States
     * const states = await prisma.state.findMany({ take: 10 })
     * 
     * // Only select the `sequence`
     * const stateWithSequenceOnly = await prisma.state.findMany({ select: { sequence: true } })
     * 
     */
    findMany<T extends StateFindManyArgs>(args?: SelectSubset<T, StateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a State.
     * @param {StateCreateArgs} args - Arguments to create a State.
     * @example
     * // Create one State
     * const State = await prisma.state.create({
     *   data: {
     *     // ... data to create a State
     *   }
     * })
     * 
     */
    create<T extends StateCreateArgs>(args: SelectSubset<T, StateCreateArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many States.
     * @param {StateCreateManyArgs} args - Arguments to create many States.
     * @example
     * // Create many States
     * const state = await prisma.state.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StateCreateManyArgs>(args?: SelectSubset<T, StateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many States and returns the data saved in the database.
     * @param {StateCreateManyAndReturnArgs} args - Arguments to create many States.
     * @example
     * // Create many States
     * const state = await prisma.state.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many States and only return the `sequence`
     * const stateWithSequenceOnly = await prisma.state.createManyAndReturn({
     *   select: { sequence: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StateCreateManyAndReturnArgs>(args?: SelectSubset<T, StateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a State.
     * @param {StateDeleteArgs} args - Arguments to delete one State.
     * @example
     * // Delete one State
     * const State = await prisma.state.delete({
     *   where: {
     *     // ... filter to delete one State
     *   }
     * })
     * 
     */
    delete<T extends StateDeleteArgs>(args: SelectSubset<T, StateDeleteArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one State.
     * @param {StateUpdateArgs} args - Arguments to update one State.
     * @example
     * // Update one State
     * const state = await prisma.state.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StateUpdateArgs>(args: SelectSubset<T, StateUpdateArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more States.
     * @param {StateDeleteManyArgs} args - Arguments to filter States to delete.
     * @example
     * // Delete a few States
     * const { count } = await prisma.state.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StateDeleteManyArgs>(args?: SelectSubset<T, StateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more States.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many States
     * const state = await prisma.state.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StateUpdateManyArgs>(args: SelectSubset<T, StateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more States and returns the data updated in the database.
     * @param {StateUpdateManyAndReturnArgs} args - Arguments to update many States.
     * @example
     * // Update many States
     * const state = await prisma.state.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more States and only return the `sequence`
     * const stateWithSequenceOnly = await prisma.state.updateManyAndReturn({
     *   select: { sequence: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StateUpdateManyAndReturnArgs>(args: SelectSubset<T, StateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one State.
     * @param {StateUpsertArgs} args - Arguments to update or create a State.
     * @example
     * // Update or create a State
     * const state = await prisma.state.upsert({
     *   create: {
     *     // ... data to create a State
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the State we want to update
     *   }
     * })
     */
    upsert<T extends StateUpsertArgs>(args: SelectSubset<T, StateUpsertArgs<ExtArgs>>): Prisma__StateClient<$Result.GetResult<Prisma.$StatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of States.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateCountArgs} args - Arguments to filter States to count.
     * @example
     * // Count the number of States
     * const count = await prisma.state.count({
     *   where: {
     *     // ... the filter for the States we want to count
     *   }
     * })
    **/
    count<T extends StateCountArgs>(
      args?: Subset<T, StateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a State.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StateAggregateArgs>(args: Subset<T, StateAggregateArgs>): Prisma.PrismaPromise<GetStateAggregateType<T>>

    /**
     * Group by State.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StateGroupByArgs['orderBy'] }
        : { orderBy?: StateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the State model
   */
  readonly fields: StateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for State.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the State model
   */
  interface StateFieldRefs {
    readonly sequence: FieldRef<"State", 'BigInt'>
    readonly address: FieldRef<"State", 'String'>
    readonly baseTokenAmount: FieldRef<"State", 'BigInt'>
    readonly baseTokenStakedAmount: FieldRef<"State", 'BigInt'>
    readonly baseTokenBorrowedAmount: FieldRef<"State", 'BigInt'>
    readonly quoteTokenAmount: FieldRef<"State", 'BigInt'>
    readonly quoteTokenStakedAmount: FieldRef<"State", 'BigInt'>
    readonly quoteTokenBorrowedAmount: FieldRef<"State", 'BigInt'>
    readonly bidAmount: FieldRef<"State", 'BigInt'>
    readonly bidPrice: FieldRef<"State", 'BigInt'>
    readonly bidIsSome: FieldRef<"State", 'Boolean'>
    readonly askAmount: FieldRef<"State", 'BigInt'>
    readonly askPrice: FieldRef<"State", 'BigInt'>
    readonly askIsSome: FieldRef<"State", 'Boolean'>
    readonly nonce: FieldRef<"State", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * State findUnique
   */
  export type StateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Filter, which State to fetch.
     */
    where: StateWhereUniqueInput
  }

  /**
   * State findUniqueOrThrow
   */
  export type StateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Filter, which State to fetch.
     */
    where: StateWhereUniqueInput
  }

  /**
   * State findFirst
   */
  export type StateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Filter, which State to fetch.
     */
    where?: StateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of States to fetch.
     */
    orderBy?: StateOrderByWithRelationInput | StateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for States.
     */
    cursor?: StateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` States from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` States.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of States.
     */
    distinct?: StateScalarFieldEnum | StateScalarFieldEnum[]
  }

  /**
   * State findFirstOrThrow
   */
  export type StateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Filter, which State to fetch.
     */
    where?: StateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of States to fetch.
     */
    orderBy?: StateOrderByWithRelationInput | StateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for States.
     */
    cursor?: StateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` States from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` States.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of States.
     */
    distinct?: StateScalarFieldEnum | StateScalarFieldEnum[]
  }

  /**
   * State findMany
   */
  export type StateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Filter, which States to fetch.
     */
    where?: StateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of States to fetch.
     */
    orderBy?: StateOrderByWithRelationInput | StateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing States.
     */
    cursor?: StateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` States from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` States.
     */
    skip?: number
    distinct?: StateScalarFieldEnum | StateScalarFieldEnum[]
  }

  /**
   * State create
   */
  export type StateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * The data needed to create a State.
     */
    data: XOR<StateCreateInput, StateUncheckedCreateInput>
  }

  /**
   * State createMany
   */
  export type StateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many States.
     */
    data: StateCreateManyInput | StateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * State createManyAndReturn
   */
  export type StateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * The data used to create many States.
     */
    data: StateCreateManyInput | StateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * State update
   */
  export type StateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * The data needed to update a State.
     */
    data: XOR<StateUpdateInput, StateUncheckedUpdateInput>
    /**
     * Choose, which State to update.
     */
    where: StateWhereUniqueInput
  }

  /**
   * State updateMany
   */
  export type StateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update States.
     */
    data: XOR<StateUpdateManyMutationInput, StateUncheckedUpdateManyInput>
    /**
     * Filter which States to update
     */
    where?: StateWhereInput
    /**
     * Limit how many States to update.
     */
    limit?: number
  }

  /**
   * State updateManyAndReturn
   */
  export type StateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * The data used to update States.
     */
    data: XOR<StateUpdateManyMutationInput, StateUncheckedUpdateManyInput>
    /**
     * Filter which States to update
     */
    where?: StateWhereInput
    /**
     * Limit how many States to update.
     */
    limit?: number
  }

  /**
   * State upsert
   */
  export type StateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * The filter to search for the State to update in case it exists.
     */
    where: StateWhereUniqueInput
    /**
     * In case the State found by the `where` argument doesn't exist, create a new State with this data.
     */
    create: XOR<StateCreateInput, StateUncheckedCreateInput>
    /**
     * In case the State was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StateUpdateInput, StateUncheckedUpdateInput>
  }

  /**
   * State delete
   */
  export type StateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
    /**
     * Filter which State to delete.
     */
    where: StateWhereUniqueInput
  }

  /**
   * State deleteMany
   */
  export type StateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which States to delete
     */
    where?: StateWhereInput
    /**
     * Limit how many States to delete.
     */
    limit?: number
  }

  /**
   * State without action
   */
  export type StateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the State
     */
    select?: StateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the State
     */
    omit?: StateOmit<ExtArgs> | null
  }


  /**
   * Model FetchedSequences
   */

  export type AggregateFetchedSequences = {
    _count: FetchedSequencesCountAggregateOutputType | null
    _avg: FetchedSequencesAvgAggregateOutputType | null
    _sum: FetchedSequencesSumAggregateOutputType | null
    _min: FetchedSequencesMinAggregateOutputType | null
    _max: FetchedSequencesMaxAggregateOutputType | null
  }

  export type FetchedSequencesAvgAggregateOutputType = {
    sequence: number | null
  }

  export type FetchedSequencesSumAggregateOutputType = {
    sequence: bigint | null
  }

  export type FetchedSequencesMinAggregateOutputType = {
    sequence: bigint | null
  }

  export type FetchedSequencesMaxAggregateOutputType = {
    sequence: bigint | null
  }

  export type FetchedSequencesCountAggregateOutputType = {
    sequence: number
    _all: number
  }


  export type FetchedSequencesAvgAggregateInputType = {
    sequence?: true
  }

  export type FetchedSequencesSumAggregateInputType = {
    sequence?: true
  }

  export type FetchedSequencesMinAggregateInputType = {
    sequence?: true
  }

  export type FetchedSequencesMaxAggregateInputType = {
    sequence?: true
  }

  export type FetchedSequencesCountAggregateInputType = {
    sequence?: true
    _all?: true
  }

  export type FetchedSequencesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FetchedSequences to aggregate.
     */
    where?: FetchedSequencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FetchedSequences to fetch.
     */
    orderBy?: FetchedSequencesOrderByWithRelationInput | FetchedSequencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FetchedSequencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FetchedSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FetchedSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FetchedSequences
    **/
    _count?: true | FetchedSequencesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FetchedSequencesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FetchedSequencesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FetchedSequencesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FetchedSequencesMaxAggregateInputType
  }

  export type GetFetchedSequencesAggregateType<T extends FetchedSequencesAggregateArgs> = {
        [P in keyof T & keyof AggregateFetchedSequences]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFetchedSequences[P]>
      : GetScalarType<T[P], AggregateFetchedSequences[P]>
  }




  export type FetchedSequencesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FetchedSequencesWhereInput
    orderBy?: FetchedSequencesOrderByWithAggregationInput | FetchedSequencesOrderByWithAggregationInput[]
    by: FetchedSequencesScalarFieldEnum[] | FetchedSequencesScalarFieldEnum
    having?: FetchedSequencesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FetchedSequencesCountAggregateInputType | true
    _avg?: FetchedSequencesAvgAggregateInputType
    _sum?: FetchedSequencesSumAggregateInputType
    _min?: FetchedSequencesMinAggregateInputType
    _max?: FetchedSequencesMaxAggregateInputType
  }

  export type FetchedSequencesGroupByOutputType = {
    sequence: bigint
    _count: FetchedSequencesCountAggregateOutputType | null
    _avg: FetchedSequencesAvgAggregateOutputType | null
    _sum: FetchedSequencesSumAggregateOutputType | null
    _min: FetchedSequencesMinAggregateOutputType | null
    _max: FetchedSequencesMaxAggregateOutputType | null
  }

  type GetFetchedSequencesGroupByPayload<T extends FetchedSequencesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FetchedSequencesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FetchedSequencesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FetchedSequencesGroupByOutputType[P]>
            : GetScalarType<T[P], FetchedSequencesGroupByOutputType[P]>
        }
      >
    >


  export type FetchedSequencesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sequence?: boolean
  }, ExtArgs["result"]["fetchedSequences"]>

  export type FetchedSequencesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sequence?: boolean
  }, ExtArgs["result"]["fetchedSequences"]>

  export type FetchedSequencesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sequence?: boolean
  }, ExtArgs["result"]["fetchedSequences"]>

  export type FetchedSequencesSelectScalar = {
    sequence?: boolean
  }

  export type FetchedSequencesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"sequence", ExtArgs["result"]["fetchedSequences"]>

  export type $FetchedSequencesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FetchedSequences"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      sequence: bigint
    }, ExtArgs["result"]["fetchedSequences"]>
    composites: {}
  }

  type FetchedSequencesGetPayload<S extends boolean | null | undefined | FetchedSequencesDefaultArgs> = $Result.GetResult<Prisma.$FetchedSequencesPayload, S>

  type FetchedSequencesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FetchedSequencesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FetchedSequencesCountAggregateInputType | true
    }

  export interface FetchedSequencesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FetchedSequences'], meta: { name: 'FetchedSequences' } }
    /**
     * Find zero or one FetchedSequences that matches the filter.
     * @param {FetchedSequencesFindUniqueArgs} args - Arguments to find a FetchedSequences
     * @example
     * // Get one FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FetchedSequencesFindUniqueArgs>(args: SelectSubset<T, FetchedSequencesFindUniqueArgs<ExtArgs>>): Prisma__FetchedSequencesClient<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FetchedSequences that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FetchedSequencesFindUniqueOrThrowArgs} args - Arguments to find a FetchedSequences
     * @example
     * // Get one FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FetchedSequencesFindUniqueOrThrowArgs>(args: SelectSubset<T, FetchedSequencesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FetchedSequencesClient<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FetchedSequences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchedSequencesFindFirstArgs} args - Arguments to find a FetchedSequences
     * @example
     * // Get one FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FetchedSequencesFindFirstArgs>(args?: SelectSubset<T, FetchedSequencesFindFirstArgs<ExtArgs>>): Prisma__FetchedSequencesClient<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FetchedSequences that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchedSequencesFindFirstOrThrowArgs} args - Arguments to find a FetchedSequences
     * @example
     * // Get one FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FetchedSequencesFindFirstOrThrowArgs>(args?: SelectSubset<T, FetchedSequencesFindFirstOrThrowArgs<ExtArgs>>): Prisma__FetchedSequencesClient<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FetchedSequences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchedSequencesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.findMany()
     * 
     * // Get first 10 FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.findMany({ take: 10 })
     * 
     * // Only select the `sequence`
     * const fetchedSequencesWithSequenceOnly = await prisma.fetchedSequences.findMany({ select: { sequence: true } })
     * 
     */
    findMany<T extends FetchedSequencesFindManyArgs>(args?: SelectSubset<T, FetchedSequencesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FetchedSequences.
     * @param {FetchedSequencesCreateArgs} args - Arguments to create a FetchedSequences.
     * @example
     * // Create one FetchedSequences
     * const FetchedSequences = await prisma.fetchedSequences.create({
     *   data: {
     *     // ... data to create a FetchedSequences
     *   }
     * })
     * 
     */
    create<T extends FetchedSequencesCreateArgs>(args: SelectSubset<T, FetchedSequencesCreateArgs<ExtArgs>>): Prisma__FetchedSequencesClient<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FetchedSequences.
     * @param {FetchedSequencesCreateManyArgs} args - Arguments to create many FetchedSequences.
     * @example
     * // Create many FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FetchedSequencesCreateManyArgs>(args?: SelectSubset<T, FetchedSequencesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FetchedSequences and returns the data saved in the database.
     * @param {FetchedSequencesCreateManyAndReturnArgs} args - Arguments to create many FetchedSequences.
     * @example
     * // Create many FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FetchedSequences and only return the `sequence`
     * const fetchedSequencesWithSequenceOnly = await prisma.fetchedSequences.createManyAndReturn({
     *   select: { sequence: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FetchedSequencesCreateManyAndReturnArgs>(args?: SelectSubset<T, FetchedSequencesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FetchedSequences.
     * @param {FetchedSequencesDeleteArgs} args - Arguments to delete one FetchedSequences.
     * @example
     * // Delete one FetchedSequences
     * const FetchedSequences = await prisma.fetchedSequences.delete({
     *   where: {
     *     // ... filter to delete one FetchedSequences
     *   }
     * })
     * 
     */
    delete<T extends FetchedSequencesDeleteArgs>(args: SelectSubset<T, FetchedSequencesDeleteArgs<ExtArgs>>): Prisma__FetchedSequencesClient<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FetchedSequences.
     * @param {FetchedSequencesUpdateArgs} args - Arguments to update one FetchedSequences.
     * @example
     * // Update one FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FetchedSequencesUpdateArgs>(args: SelectSubset<T, FetchedSequencesUpdateArgs<ExtArgs>>): Prisma__FetchedSequencesClient<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FetchedSequences.
     * @param {FetchedSequencesDeleteManyArgs} args - Arguments to filter FetchedSequences to delete.
     * @example
     * // Delete a few FetchedSequences
     * const { count } = await prisma.fetchedSequences.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FetchedSequencesDeleteManyArgs>(args?: SelectSubset<T, FetchedSequencesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FetchedSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchedSequencesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FetchedSequencesUpdateManyArgs>(args: SelectSubset<T, FetchedSequencesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FetchedSequences and returns the data updated in the database.
     * @param {FetchedSequencesUpdateManyAndReturnArgs} args - Arguments to update many FetchedSequences.
     * @example
     * // Update many FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FetchedSequences and only return the `sequence`
     * const fetchedSequencesWithSequenceOnly = await prisma.fetchedSequences.updateManyAndReturn({
     *   select: { sequence: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FetchedSequencesUpdateManyAndReturnArgs>(args: SelectSubset<T, FetchedSequencesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FetchedSequences.
     * @param {FetchedSequencesUpsertArgs} args - Arguments to update or create a FetchedSequences.
     * @example
     * // Update or create a FetchedSequences
     * const fetchedSequences = await prisma.fetchedSequences.upsert({
     *   create: {
     *     // ... data to create a FetchedSequences
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FetchedSequences we want to update
     *   }
     * })
     */
    upsert<T extends FetchedSequencesUpsertArgs>(args: SelectSubset<T, FetchedSequencesUpsertArgs<ExtArgs>>): Prisma__FetchedSequencesClient<$Result.GetResult<Prisma.$FetchedSequencesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FetchedSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchedSequencesCountArgs} args - Arguments to filter FetchedSequences to count.
     * @example
     * // Count the number of FetchedSequences
     * const count = await prisma.fetchedSequences.count({
     *   where: {
     *     // ... the filter for the FetchedSequences we want to count
     *   }
     * })
    **/
    count<T extends FetchedSequencesCountArgs>(
      args?: Subset<T, FetchedSequencesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FetchedSequencesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FetchedSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchedSequencesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FetchedSequencesAggregateArgs>(args: Subset<T, FetchedSequencesAggregateArgs>): Prisma.PrismaPromise<GetFetchedSequencesAggregateType<T>>

    /**
     * Group by FetchedSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FetchedSequencesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FetchedSequencesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FetchedSequencesGroupByArgs['orderBy'] }
        : { orderBy?: FetchedSequencesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FetchedSequencesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFetchedSequencesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FetchedSequences model
   */
  readonly fields: FetchedSequencesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FetchedSequences.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FetchedSequencesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FetchedSequences model
   */
  interface FetchedSequencesFieldRefs {
    readonly sequence: FieldRef<"FetchedSequences", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * FetchedSequences findUnique
   */
  export type FetchedSequencesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * Filter, which FetchedSequences to fetch.
     */
    where: FetchedSequencesWhereUniqueInput
  }

  /**
   * FetchedSequences findUniqueOrThrow
   */
  export type FetchedSequencesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * Filter, which FetchedSequences to fetch.
     */
    where: FetchedSequencesWhereUniqueInput
  }

  /**
   * FetchedSequences findFirst
   */
  export type FetchedSequencesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * Filter, which FetchedSequences to fetch.
     */
    where?: FetchedSequencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FetchedSequences to fetch.
     */
    orderBy?: FetchedSequencesOrderByWithRelationInput | FetchedSequencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FetchedSequences.
     */
    cursor?: FetchedSequencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FetchedSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FetchedSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FetchedSequences.
     */
    distinct?: FetchedSequencesScalarFieldEnum | FetchedSequencesScalarFieldEnum[]
  }

  /**
   * FetchedSequences findFirstOrThrow
   */
  export type FetchedSequencesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * Filter, which FetchedSequences to fetch.
     */
    where?: FetchedSequencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FetchedSequences to fetch.
     */
    orderBy?: FetchedSequencesOrderByWithRelationInput | FetchedSequencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FetchedSequences.
     */
    cursor?: FetchedSequencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FetchedSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FetchedSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FetchedSequences.
     */
    distinct?: FetchedSequencesScalarFieldEnum | FetchedSequencesScalarFieldEnum[]
  }

  /**
   * FetchedSequences findMany
   */
  export type FetchedSequencesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * Filter, which FetchedSequences to fetch.
     */
    where?: FetchedSequencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FetchedSequences to fetch.
     */
    orderBy?: FetchedSequencesOrderByWithRelationInput | FetchedSequencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FetchedSequences.
     */
    cursor?: FetchedSequencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FetchedSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FetchedSequences.
     */
    skip?: number
    distinct?: FetchedSequencesScalarFieldEnum | FetchedSequencesScalarFieldEnum[]
  }

  /**
   * FetchedSequences create
   */
  export type FetchedSequencesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * The data needed to create a FetchedSequences.
     */
    data: XOR<FetchedSequencesCreateInput, FetchedSequencesUncheckedCreateInput>
  }

  /**
   * FetchedSequences createMany
   */
  export type FetchedSequencesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FetchedSequences.
     */
    data: FetchedSequencesCreateManyInput | FetchedSequencesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FetchedSequences createManyAndReturn
   */
  export type FetchedSequencesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * The data used to create many FetchedSequences.
     */
    data: FetchedSequencesCreateManyInput | FetchedSequencesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FetchedSequences update
   */
  export type FetchedSequencesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * The data needed to update a FetchedSequences.
     */
    data: XOR<FetchedSequencesUpdateInput, FetchedSequencesUncheckedUpdateInput>
    /**
     * Choose, which FetchedSequences to update.
     */
    where: FetchedSequencesWhereUniqueInput
  }

  /**
   * FetchedSequences updateMany
   */
  export type FetchedSequencesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FetchedSequences.
     */
    data: XOR<FetchedSequencesUpdateManyMutationInput, FetchedSequencesUncheckedUpdateManyInput>
    /**
     * Filter which FetchedSequences to update
     */
    where?: FetchedSequencesWhereInput
    /**
     * Limit how many FetchedSequences to update.
     */
    limit?: number
  }

  /**
   * FetchedSequences updateManyAndReturn
   */
  export type FetchedSequencesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * The data used to update FetchedSequences.
     */
    data: XOR<FetchedSequencesUpdateManyMutationInput, FetchedSequencesUncheckedUpdateManyInput>
    /**
     * Filter which FetchedSequences to update
     */
    where?: FetchedSequencesWhereInput
    /**
     * Limit how many FetchedSequences to update.
     */
    limit?: number
  }

  /**
   * FetchedSequences upsert
   */
  export type FetchedSequencesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * The filter to search for the FetchedSequences to update in case it exists.
     */
    where: FetchedSequencesWhereUniqueInput
    /**
     * In case the FetchedSequences found by the `where` argument doesn't exist, create a new FetchedSequences with this data.
     */
    create: XOR<FetchedSequencesCreateInput, FetchedSequencesUncheckedCreateInput>
    /**
     * In case the FetchedSequences was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FetchedSequencesUpdateInput, FetchedSequencesUncheckedUpdateInput>
  }

  /**
   * FetchedSequences delete
   */
  export type FetchedSequencesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
    /**
     * Filter which FetchedSequences to delete.
     */
    where: FetchedSequencesWhereUniqueInput
  }

  /**
   * FetchedSequences deleteMany
   */
  export type FetchedSequencesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FetchedSequences to delete
     */
    where?: FetchedSequencesWhereInput
    /**
     * Limit how many FetchedSequences to delete.
     */
    limit?: number
  }

  /**
   * FetchedSequences without action
   */
  export type FetchedSequencesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FetchedSequences
     */
    select?: FetchedSequencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FetchedSequences
     */
    omit?: FetchedSequencesOmit<ExtArgs> | null
  }


  /**
   * Model ActionRequest
   */

  export type AggregateActionRequest = {
    _count: ActionRequestCountAggregateOutputType | null
    _avg: ActionRequestAvgAggregateOutputType | null
    _sum: ActionRequestSumAggregateOutputType | null
    _min: ActionRequestMinAggregateOutputType | null
    _max: ActionRequestMaxAggregateOutputType | null
  }

  export type ActionRequestAvgAggregateOutputType = {
    id: number | null
    baseBalance: number | null
    quoteBalance: number | null
    baseTokenAmount: number | null
    price: number | null
    nonce: number | null
    userSignatureR: number | null
    userSignatureS: number | null
    quoteTokenAmount: number | null
    buyerNonce: number | null
    sellerNonce: number | null
    senderNonce: number | null
    receiverNonce: number | null
    senderSignatureR: number | null
    senderSignatureS: number | null
  }

  export type ActionRequestSumAggregateOutputType = {
    id: number | null
    baseBalance: bigint | null
    quoteBalance: bigint | null
    baseTokenAmount: bigint | null
    price: bigint | null
    nonce: bigint | null
    userSignatureR: bigint | null
    userSignatureS: bigint | null
    quoteTokenAmount: bigint | null
    buyerNonce: bigint | null
    sellerNonce: bigint | null
    senderNonce: bigint | null
    receiverNonce: bigint | null
    senderSignatureR: bigint | null
    senderSignatureS: bigint | null
  }

  export type ActionRequestMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    operation: $Enums.Operation | null
    status: $Enums.ActionStatus | null
    address: string | null
    poolPublicKey: string | null
    publicKey: string | null
    publicKeyBase58: string | null
    name: string | null
    role: string | null
    image: string | null
    baseBalance: bigint | null
    quoteBalance: bigint | null
    userPublicKey: string | null
    baseTokenAmount: bigint | null
    price: bigint | null
    isSome: boolean | null
    nonce: bigint | null
    userSignatureR: bigint | null
    userSignatureS: bigint | null
    buyerPublicKey: string | null
    sellerPublicKey: string | null
    quoteTokenAmount: bigint | null
    buyerNonce: bigint | null
    sellerNonce: bigint | null
    senderPublicKey: string | null
    receiverPublicKey: string | null
    senderNonce: bigint | null
    receiverNonce: bigint | null
    senderSignatureR: bigint | null
    senderSignatureS: bigint | null
  }

  export type ActionRequestMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    operation: $Enums.Operation | null
    status: $Enums.ActionStatus | null
    address: string | null
    poolPublicKey: string | null
    publicKey: string | null
    publicKeyBase58: string | null
    name: string | null
    role: string | null
    image: string | null
    baseBalance: bigint | null
    quoteBalance: bigint | null
    userPublicKey: string | null
    baseTokenAmount: bigint | null
    price: bigint | null
    isSome: boolean | null
    nonce: bigint | null
    userSignatureR: bigint | null
    userSignatureS: bigint | null
    buyerPublicKey: string | null
    sellerPublicKey: string | null
    quoteTokenAmount: bigint | null
    buyerNonce: bigint | null
    sellerNonce: bigint | null
    senderPublicKey: string | null
    receiverPublicKey: string | null
    senderNonce: bigint | null
    receiverNonce: bigint | null
    senderSignatureR: bigint | null
    senderSignatureS: bigint | null
  }

  export type ActionRequestCountAggregateOutputType = {
    id: number
    createdAt: number
    operation: number
    status: number
    address: number
    poolPublicKey: number
    publicKey: number
    publicKeyBase58: number
    name: number
    role: number
    image: number
    baseBalance: number
    quoteBalance: number
    userPublicKey: number
    baseTokenAmount: number
    price: number
    isSome: number
    nonce: number
    userSignatureR: number
    userSignatureS: number
    buyerPublicKey: number
    sellerPublicKey: number
    quoteTokenAmount: number
    buyerNonce: number
    sellerNonce: number
    senderPublicKey: number
    receiverPublicKey: number
    senderNonce: number
    receiverNonce: number
    senderSignatureR: number
    senderSignatureS: number
    _all: number
  }


  export type ActionRequestAvgAggregateInputType = {
    id?: true
    baseBalance?: true
    quoteBalance?: true
    baseTokenAmount?: true
    price?: true
    nonce?: true
    userSignatureR?: true
    userSignatureS?: true
    quoteTokenAmount?: true
    buyerNonce?: true
    sellerNonce?: true
    senderNonce?: true
    receiverNonce?: true
    senderSignatureR?: true
    senderSignatureS?: true
  }

  export type ActionRequestSumAggregateInputType = {
    id?: true
    baseBalance?: true
    quoteBalance?: true
    baseTokenAmount?: true
    price?: true
    nonce?: true
    userSignatureR?: true
    userSignatureS?: true
    quoteTokenAmount?: true
    buyerNonce?: true
    sellerNonce?: true
    senderNonce?: true
    receiverNonce?: true
    senderSignatureR?: true
    senderSignatureS?: true
  }

  export type ActionRequestMinAggregateInputType = {
    id?: true
    createdAt?: true
    operation?: true
    status?: true
    address?: true
    poolPublicKey?: true
    publicKey?: true
    publicKeyBase58?: true
    name?: true
    role?: true
    image?: true
    baseBalance?: true
    quoteBalance?: true
    userPublicKey?: true
    baseTokenAmount?: true
    price?: true
    isSome?: true
    nonce?: true
    userSignatureR?: true
    userSignatureS?: true
    buyerPublicKey?: true
    sellerPublicKey?: true
    quoteTokenAmount?: true
    buyerNonce?: true
    sellerNonce?: true
    senderPublicKey?: true
    receiverPublicKey?: true
    senderNonce?: true
    receiverNonce?: true
    senderSignatureR?: true
    senderSignatureS?: true
  }

  export type ActionRequestMaxAggregateInputType = {
    id?: true
    createdAt?: true
    operation?: true
    status?: true
    address?: true
    poolPublicKey?: true
    publicKey?: true
    publicKeyBase58?: true
    name?: true
    role?: true
    image?: true
    baseBalance?: true
    quoteBalance?: true
    userPublicKey?: true
    baseTokenAmount?: true
    price?: true
    isSome?: true
    nonce?: true
    userSignatureR?: true
    userSignatureS?: true
    buyerPublicKey?: true
    sellerPublicKey?: true
    quoteTokenAmount?: true
    buyerNonce?: true
    sellerNonce?: true
    senderPublicKey?: true
    receiverPublicKey?: true
    senderNonce?: true
    receiverNonce?: true
    senderSignatureR?: true
    senderSignatureS?: true
  }

  export type ActionRequestCountAggregateInputType = {
    id?: true
    createdAt?: true
    operation?: true
    status?: true
    address?: true
    poolPublicKey?: true
    publicKey?: true
    publicKeyBase58?: true
    name?: true
    role?: true
    image?: true
    baseBalance?: true
    quoteBalance?: true
    userPublicKey?: true
    baseTokenAmount?: true
    price?: true
    isSome?: true
    nonce?: true
    userSignatureR?: true
    userSignatureS?: true
    buyerPublicKey?: true
    sellerPublicKey?: true
    quoteTokenAmount?: true
    buyerNonce?: true
    sellerNonce?: true
    senderPublicKey?: true
    receiverPublicKey?: true
    senderNonce?: true
    receiverNonce?: true
    senderSignatureR?: true
    senderSignatureS?: true
    _all?: true
  }

  export type ActionRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionRequest to aggregate.
     */
    where?: ActionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionRequests to fetch.
     */
    orderBy?: ActionRequestOrderByWithRelationInput | ActionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActionRequests
    **/
    _count?: true | ActionRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ActionRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ActionRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActionRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActionRequestMaxAggregateInputType
  }

  export type GetActionRequestAggregateType<T extends ActionRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateActionRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActionRequest[P]>
      : GetScalarType<T[P], AggregateActionRequest[P]>
  }




  export type ActionRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionRequestWhereInput
    orderBy?: ActionRequestOrderByWithAggregationInput | ActionRequestOrderByWithAggregationInput[]
    by: ActionRequestScalarFieldEnum[] | ActionRequestScalarFieldEnum
    having?: ActionRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActionRequestCountAggregateInputType | true
    _avg?: ActionRequestAvgAggregateInputType
    _sum?: ActionRequestSumAggregateInputType
    _min?: ActionRequestMinAggregateInputType
    _max?: ActionRequestMaxAggregateInputType
  }

  export type ActionRequestGroupByOutputType = {
    id: number
    createdAt: Date
    operation: $Enums.Operation
    status: $Enums.ActionStatus
    address: string | null
    poolPublicKey: string | null
    publicKey: string | null
    publicKeyBase58: string | null
    name: string | null
    role: string | null
    image: string | null
    baseBalance: bigint | null
    quoteBalance: bigint | null
    userPublicKey: string | null
    baseTokenAmount: bigint | null
    price: bigint | null
    isSome: boolean | null
    nonce: bigint | null
    userSignatureR: bigint | null
    userSignatureS: bigint | null
    buyerPublicKey: string | null
    sellerPublicKey: string | null
    quoteTokenAmount: bigint | null
    buyerNonce: bigint | null
    sellerNonce: bigint | null
    senderPublicKey: string | null
    receiverPublicKey: string | null
    senderNonce: bigint | null
    receiverNonce: bigint | null
    senderSignatureR: bigint | null
    senderSignatureS: bigint | null
    _count: ActionRequestCountAggregateOutputType | null
    _avg: ActionRequestAvgAggregateOutputType | null
    _sum: ActionRequestSumAggregateOutputType | null
    _min: ActionRequestMinAggregateOutputType | null
    _max: ActionRequestMaxAggregateOutputType | null
  }

  type GetActionRequestGroupByPayload<T extends ActionRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActionRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActionRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActionRequestGroupByOutputType[P]>
            : GetScalarType<T[P], ActionRequestGroupByOutputType[P]>
        }
      >
    >


  export type ActionRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    operation?: boolean
    status?: boolean
    address?: boolean
    poolPublicKey?: boolean
    publicKey?: boolean
    publicKeyBase58?: boolean
    name?: boolean
    role?: boolean
    image?: boolean
    baseBalance?: boolean
    quoteBalance?: boolean
    userPublicKey?: boolean
    baseTokenAmount?: boolean
    price?: boolean
    isSome?: boolean
    nonce?: boolean
    userSignatureR?: boolean
    userSignatureS?: boolean
    buyerPublicKey?: boolean
    sellerPublicKey?: boolean
    quoteTokenAmount?: boolean
    buyerNonce?: boolean
    sellerNonce?: boolean
    senderPublicKey?: boolean
    receiverPublicKey?: boolean
    senderNonce?: boolean
    receiverNonce?: boolean
    senderSignatureR?: boolean
    senderSignatureS?: boolean
  }, ExtArgs["result"]["actionRequest"]>

  export type ActionRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    operation?: boolean
    status?: boolean
    address?: boolean
    poolPublicKey?: boolean
    publicKey?: boolean
    publicKeyBase58?: boolean
    name?: boolean
    role?: boolean
    image?: boolean
    baseBalance?: boolean
    quoteBalance?: boolean
    userPublicKey?: boolean
    baseTokenAmount?: boolean
    price?: boolean
    isSome?: boolean
    nonce?: boolean
    userSignatureR?: boolean
    userSignatureS?: boolean
    buyerPublicKey?: boolean
    sellerPublicKey?: boolean
    quoteTokenAmount?: boolean
    buyerNonce?: boolean
    sellerNonce?: boolean
    senderPublicKey?: boolean
    receiverPublicKey?: boolean
    senderNonce?: boolean
    receiverNonce?: boolean
    senderSignatureR?: boolean
    senderSignatureS?: boolean
  }, ExtArgs["result"]["actionRequest"]>

  export type ActionRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    operation?: boolean
    status?: boolean
    address?: boolean
    poolPublicKey?: boolean
    publicKey?: boolean
    publicKeyBase58?: boolean
    name?: boolean
    role?: boolean
    image?: boolean
    baseBalance?: boolean
    quoteBalance?: boolean
    userPublicKey?: boolean
    baseTokenAmount?: boolean
    price?: boolean
    isSome?: boolean
    nonce?: boolean
    userSignatureR?: boolean
    userSignatureS?: boolean
    buyerPublicKey?: boolean
    sellerPublicKey?: boolean
    quoteTokenAmount?: boolean
    buyerNonce?: boolean
    sellerNonce?: boolean
    senderPublicKey?: boolean
    receiverPublicKey?: boolean
    senderNonce?: boolean
    receiverNonce?: boolean
    senderSignatureR?: boolean
    senderSignatureS?: boolean
  }, ExtArgs["result"]["actionRequest"]>

  export type ActionRequestSelectScalar = {
    id?: boolean
    createdAt?: boolean
    operation?: boolean
    status?: boolean
    address?: boolean
    poolPublicKey?: boolean
    publicKey?: boolean
    publicKeyBase58?: boolean
    name?: boolean
    role?: boolean
    image?: boolean
    baseBalance?: boolean
    quoteBalance?: boolean
    userPublicKey?: boolean
    baseTokenAmount?: boolean
    price?: boolean
    isSome?: boolean
    nonce?: boolean
    userSignatureR?: boolean
    userSignatureS?: boolean
    buyerPublicKey?: boolean
    sellerPublicKey?: boolean
    quoteTokenAmount?: boolean
    buyerNonce?: boolean
    sellerNonce?: boolean
    senderPublicKey?: boolean
    receiverPublicKey?: boolean
    senderNonce?: boolean
    receiverNonce?: boolean
    senderSignatureR?: boolean
    senderSignatureS?: boolean
  }

  export type ActionRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "operation" | "status" | "address" | "poolPublicKey" | "publicKey" | "publicKeyBase58" | "name" | "role" | "image" | "baseBalance" | "quoteBalance" | "userPublicKey" | "baseTokenAmount" | "price" | "isSome" | "nonce" | "userSignatureR" | "userSignatureS" | "buyerPublicKey" | "sellerPublicKey" | "quoteTokenAmount" | "buyerNonce" | "sellerNonce" | "senderPublicKey" | "receiverPublicKey" | "senderNonce" | "receiverNonce" | "senderSignatureR" | "senderSignatureS", ExtArgs["result"]["actionRequest"]>

  export type $ActionRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActionRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      createdAt: Date
      operation: $Enums.Operation
      status: $Enums.ActionStatus
      address: string | null
      poolPublicKey: string | null
      publicKey: string | null
      publicKeyBase58: string | null
      name: string | null
      role: string | null
      image: string | null
      baseBalance: bigint | null
      quoteBalance: bigint | null
      userPublicKey: string | null
      baseTokenAmount: bigint | null
      price: bigint | null
      isSome: boolean | null
      nonce: bigint | null
      userSignatureR: bigint | null
      userSignatureS: bigint | null
      buyerPublicKey: string | null
      sellerPublicKey: string | null
      quoteTokenAmount: bigint | null
      buyerNonce: bigint | null
      sellerNonce: bigint | null
      senderPublicKey: string | null
      receiverPublicKey: string | null
      senderNonce: bigint | null
      receiverNonce: bigint | null
      senderSignatureR: bigint | null
      senderSignatureS: bigint | null
    }, ExtArgs["result"]["actionRequest"]>
    composites: {}
  }

  type ActionRequestGetPayload<S extends boolean | null | undefined | ActionRequestDefaultArgs> = $Result.GetResult<Prisma.$ActionRequestPayload, S>

  type ActionRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ActionRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ActionRequestCountAggregateInputType | true
    }

  export interface ActionRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActionRequest'], meta: { name: 'ActionRequest' } }
    /**
     * Find zero or one ActionRequest that matches the filter.
     * @param {ActionRequestFindUniqueArgs} args - Arguments to find a ActionRequest
     * @example
     * // Get one ActionRequest
     * const actionRequest = await prisma.actionRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActionRequestFindUniqueArgs>(args: SelectSubset<T, ActionRequestFindUniqueArgs<ExtArgs>>): Prisma__ActionRequestClient<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ActionRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ActionRequestFindUniqueOrThrowArgs} args - Arguments to find a ActionRequest
     * @example
     * // Get one ActionRequest
     * const actionRequest = await prisma.actionRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActionRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, ActionRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActionRequestClient<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ActionRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionRequestFindFirstArgs} args - Arguments to find a ActionRequest
     * @example
     * // Get one ActionRequest
     * const actionRequest = await prisma.actionRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActionRequestFindFirstArgs>(args?: SelectSubset<T, ActionRequestFindFirstArgs<ExtArgs>>): Prisma__ActionRequestClient<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ActionRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionRequestFindFirstOrThrowArgs} args - Arguments to find a ActionRequest
     * @example
     * // Get one ActionRequest
     * const actionRequest = await prisma.actionRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActionRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, ActionRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActionRequestClient<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ActionRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActionRequests
     * const actionRequests = await prisma.actionRequest.findMany()
     * 
     * // Get first 10 ActionRequests
     * const actionRequests = await prisma.actionRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const actionRequestWithIdOnly = await prisma.actionRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActionRequestFindManyArgs>(args?: SelectSubset<T, ActionRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ActionRequest.
     * @param {ActionRequestCreateArgs} args - Arguments to create a ActionRequest.
     * @example
     * // Create one ActionRequest
     * const ActionRequest = await prisma.actionRequest.create({
     *   data: {
     *     // ... data to create a ActionRequest
     *   }
     * })
     * 
     */
    create<T extends ActionRequestCreateArgs>(args: SelectSubset<T, ActionRequestCreateArgs<ExtArgs>>): Prisma__ActionRequestClient<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ActionRequests.
     * @param {ActionRequestCreateManyArgs} args - Arguments to create many ActionRequests.
     * @example
     * // Create many ActionRequests
     * const actionRequest = await prisma.actionRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActionRequestCreateManyArgs>(args?: SelectSubset<T, ActionRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActionRequests and returns the data saved in the database.
     * @param {ActionRequestCreateManyAndReturnArgs} args - Arguments to create many ActionRequests.
     * @example
     * // Create many ActionRequests
     * const actionRequest = await prisma.actionRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActionRequests and only return the `id`
     * const actionRequestWithIdOnly = await prisma.actionRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActionRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, ActionRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ActionRequest.
     * @param {ActionRequestDeleteArgs} args - Arguments to delete one ActionRequest.
     * @example
     * // Delete one ActionRequest
     * const ActionRequest = await prisma.actionRequest.delete({
     *   where: {
     *     // ... filter to delete one ActionRequest
     *   }
     * })
     * 
     */
    delete<T extends ActionRequestDeleteArgs>(args: SelectSubset<T, ActionRequestDeleteArgs<ExtArgs>>): Prisma__ActionRequestClient<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ActionRequest.
     * @param {ActionRequestUpdateArgs} args - Arguments to update one ActionRequest.
     * @example
     * // Update one ActionRequest
     * const actionRequest = await prisma.actionRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActionRequestUpdateArgs>(args: SelectSubset<T, ActionRequestUpdateArgs<ExtArgs>>): Prisma__ActionRequestClient<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ActionRequests.
     * @param {ActionRequestDeleteManyArgs} args - Arguments to filter ActionRequests to delete.
     * @example
     * // Delete a few ActionRequests
     * const { count } = await prisma.actionRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActionRequestDeleteManyArgs>(args?: SelectSubset<T, ActionRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActionRequests
     * const actionRequest = await prisma.actionRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActionRequestUpdateManyArgs>(args: SelectSubset<T, ActionRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActionRequests and returns the data updated in the database.
     * @param {ActionRequestUpdateManyAndReturnArgs} args - Arguments to update many ActionRequests.
     * @example
     * // Update many ActionRequests
     * const actionRequest = await prisma.actionRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ActionRequests and only return the `id`
     * const actionRequestWithIdOnly = await prisma.actionRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ActionRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, ActionRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ActionRequest.
     * @param {ActionRequestUpsertArgs} args - Arguments to update or create a ActionRequest.
     * @example
     * // Update or create a ActionRequest
     * const actionRequest = await prisma.actionRequest.upsert({
     *   create: {
     *     // ... data to create a ActionRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActionRequest we want to update
     *   }
     * })
     */
    upsert<T extends ActionRequestUpsertArgs>(args: SelectSubset<T, ActionRequestUpsertArgs<ExtArgs>>): Prisma__ActionRequestClient<$Result.GetResult<Prisma.$ActionRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ActionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionRequestCountArgs} args - Arguments to filter ActionRequests to count.
     * @example
     * // Count the number of ActionRequests
     * const count = await prisma.actionRequest.count({
     *   where: {
     *     // ... the filter for the ActionRequests we want to count
     *   }
     * })
    **/
    count<T extends ActionRequestCountArgs>(
      args?: Subset<T, ActionRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActionRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActionRequestAggregateArgs>(args: Subset<T, ActionRequestAggregateArgs>): Prisma.PrismaPromise<GetActionRequestAggregateType<T>>

    /**
     * Group by ActionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActionRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActionRequestGroupByArgs['orderBy'] }
        : { orderBy?: ActionRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActionRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActionRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActionRequest model
   */
  readonly fields: ActionRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActionRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActionRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ActionRequest model
   */
  interface ActionRequestFieldRefs {
    readonly id: FieldRef<"ActionRequest", 'Int'>
    readonly createdAt: FieldRef<"ActionRequest", 'DateTime'>
    readonly operation: FieldRef<"ActionRequest", 'Operation'>
    readonly status: FieldRef<"ActionRequest", 'ActionStatus'>
    readonly address: FieldRef<"ActionRequest", 'String'>
    readonly poolPublicKey: FieldRef<"ActionRequest", 'String'>
    readonly publicKey: FieldRef<"ActionRequest", 'String'>
    readonly publicKeyBase58: FieldRef<"ActionRequest", 'String'>
    readonly name: FieldRef<"ActionRequest", 'String'>
    readonly role: FieldRef<"ActionRequest", 'String'>
    readonly image: FieldRef<"ActionRequest", 'String'>
    readonly baseBalance: FieldRef<"ActionRequest", 'BigInt'>
    readonly quoteBalance: FieldRef<"ActionRequest", 'BigInt'>
    readonly userPublicKey: FieldRef<"ActionRequest", 'String'>
    readonly baseTokenAmount: FieldRef<"ActionRequest", 'BigInt'>
    readonly price: FieldRef<"ActionRequest", 'BigInt'>
    readonly isSome: FieldRef<"ActionRequest", 'Boolean'>
    readonly nonce: FieldRef<"ActionRequest", 'BigInt'>
    readonly userSignatureR: FieldRef<"ActionRequest", 'BigInt'>
    readonly userSignatureS: FieldRef<"ActionRequest", 'BigInt'>
    readonly buyerPublicKey: FieldRef<"ActionRequest", 'String'>
    readonly sellerPublicKey: FieldRef<"ActionRequest", 'String'>
    readonly quoteTokenAmount: FieldRef<"ActionRequest", 'BigInt'>
    readonly buyerNonce: FieldRef<"ActionRequest", 'BigInt'>
    readonly sellerNonce: FieldRef<"ActionRequest", 'BigInt'>
    readonly senderPublicKey: FieldRef<"ActionRequest", 'String'>
    readonly receiverPublicKey: FieldRef<"ActionRequest", 'String'>
    readonly senderNonce: FieldRef<"ActionRequest", 'BigInt'>
    readonly receiverNonce: FieldRef<"ActionRequest", 'BigInt'>
    readonly senderSignatureR: FieldRef<"ActionRequest", 'BigInt'>
    readonly senderSignatureS: FieldRef<"ActionRequest", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * ActionRequest findUnique
   */
  export type ActionRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * Filter, which ActionRequest to fetch.
     */
    where: ActionRequestWhereUniqueInput
  }

  /**
   * ActionRequest findUniqueOrThrow
   */
  export type ActionRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * Filter, which ActionRequest to fetch.
     */
    where: ActionRequestWhereUniqueInput
  }

  /**
   * ActionRequest findFirst
   */
  export type ActionRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * Filter, which ActionRequest to fetch.
     */
    where?: ActionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionRequests to fetch.
     */
    orderBy?: ActionRequestOrderByWithRelationInput | ActionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionRequests.
     */
    cursor?: ActionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionRequests.
     */
    distinct?: ActionRequestScalarFieldEnum | ActionRequestScalarFieldEnum[]
  }

  /**
   * ActionRequest findFirstOrThrow
   */
  export type ActionRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * Filter, which ActionRequest to fetch.
     */
    where?: ActionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionRequests to fetch.
     */
    orderBy?: ActionRequestOrderByWithRelationInput | ActionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionRequests.
     */
    cursor?: ActionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionRequests.
     */
    distinct?: ActionRequestScalarFieldEnum | ActionRequestScalarFieldEnum[]
  }

  /**
   * ActionRequest findMany
   */
  export type ActionRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * Filter, which ActionRequests to fetch.
     */
    where?: ActionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionRequests to fetch.
     */
    orderBy?: ActionRequestOrderByWithRelationInput | ActionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActionRequests.
     */
    cursor?: ActionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionRequests.
     */
    skip?: number
    distinct?: ActionRequestScalarFieldEnum | ActionRequestScalarFieldEnum[]
  }

  /**
   * ActionRequest create
   */
  export type ActionRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * The data needed to create a ActionRequest.
     */
    data: XOR<ActionRequestCreateInput, ActionRequestUncheckedCreateInput>
  }

  /**
   * ActionRequest createMany
   */
  export type ActionRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActionRequests.
     */
    data: ActionRequestCreateManyInput | ActionRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActionRequest createManyAndReturn
   */
  export type ActionRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * The data used to create many ActionRequests.
     */
    data: ActionRequestCreateManyInput | ActionRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActionRequest update
   */
  export type ActionRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * The data needed to update a ActionRequest.
     */
    data: XOR<ActionRequestUpdateInput, ActionRequestUncheckedUpdateInput>
    /**
     * Choose, which ActionRequest to update.
     */
    where: ActionRequestWhereUniqueInput
  }

  /**
   * ActionRequest updateMany
   */
  export type ActionRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActionRequests.
     */
    data: XOR<ActionRequestUpdateManyMutationInput, ActionRequestUncheckedUpdateManyInput>
    /**
     * Filter which ActionRequests to update
     */
    where?: ActionRequestWhereInput
    /**
     * Limit how many ActionRequests to update.
     */
    limit?: number
  }

  /**
   * ActionRequest updateManyAndReturn
   */
  export type ActionRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * The data used to update ActionRequests.
     */
    data: XOR<ActionRequestUpdateManyMutationInput, ActionRequestUncheckedUpdateManyInput>
    /**
     * Filter which ActionRequests to update
     */
    where?: ActionRequestWhereInput
    /**
     * Limit how many ActionRequests to update.
     */
    limit?: number
  }

  /**
   * ActionRequest upsert
   */
  export type ActionRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * The filter to search for the ActionRequest to update in case it exists.
     */
    where: ActionRequestWhereUniqueInput
    /**
     * In case the ActionRequest found by the `where` argument doesn't exist, create a new ActionRequest with this data.
     */
    create: XOR<ActionRequestCreateInput, ActionRequestUncheckedCreateInput>
    /**
     * In case the ActionRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActionRequestUpdateInput, ActionRequestUncheckedUpdateInput>
  }

  /**
   * ActionRequest delete
   */
  export type ActionRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
    /**
     * Filter which ActionRequest to delete.
     */
    where: ActionRequestWhereUniqueInput
  }

  /**
   * ActionRequest deleteMany
   */
  export type ActionRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionRequests to delete
     */
    where?: ActionRequestWhereInput
    /**
     * Limit how many ActionRequests to delete.
     */
    limit?: number
  }

  /**
   * ActionRequest without action
   */
  export type ActionRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionRequest
     */
    select?: ActionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionRequest
     */
    omit?: ActionRequestOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const StateScalarFieldEnum: {
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

  export type StateScalarFieldEnum = (typeof StateScalarFieldEnum)[keyof typeof StateScalarFieldEnum]


  export const FetchedSequencesScalarFieldEnum: {
    sequence: 'sequence'
  };

  export type FetchedSequencesScalarFieldEnum = (typeof FetchedSequencesScalarFieldEnum)[keyof typeof FetchedSequencesScalarFieldEnum]


  export const ActionRequestScalarFieldEnum: {
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
    senderSignatureS: 'senderSignatureS'
  };

  export type ActionRequestScalarFieldEnum = (typeof ActionRequestScalarFieldEnum)[keyof typeof ActionRequestScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Operation'
   */
  export type EnumOperationFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Operation'>
    


  /**
   * Reference to a field of type 'Operation[]'
   */
  export type ListEnumOperationFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Operation[]'>
    


  /**
   * Reference to a field of type 'ActionStatus'
   */
  export type EnumActionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActionStatus'>
    


  /**
   * Reference to a field of type 'ActionStatus[]'
   */
  export type ListEnumActionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActionStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type StateWhereInput = {
    AND?: StateWhereInput | StateWhereInput[]
    OR?: StateWhereInput[]
    NOT?: StateWhereInput | StateWhereInput[]
    sequence?: BigIntFilter<"State"> | bigint | number
    address?: StringFilter<"State"> | string
    baseTokenAmount?: BigIntFilter<"State"> | bigint | number
    baseTokenStakedAmount?: BigIntFilter<"State"> | bigint | number
    baseTokenBorrowedAmount?: BigIntFilter<"State"> | bigint | number
    quoteTokenAmount?: BigIntFilter<"State"> | bigint | number
    quoteTokenStakedAmount?: BigIntFilter<"State"> | bigint | number
    quoteTokenBorrowedAmount?: BigIntFilter<"State"> | bigint | number
    bidAmount?: BigIntFilter<"State"> | bigint | number
    bidPrice?: BigIntFilter<"State"> | bigint | number
    bidIsSome?: BoolFilter<"State"> | boolean
    askAmount?: BigIntFilter<"State"> | bigint | number
    askPrice?: BigIntFilter<"State"> | bigint | number
    askIsSome?: BoolFilter<"State"> | boolean
    nonce?: BigIntFilter<"State"> | bigint | number
  }

  export type StateOrderByWithRelationInput = {
    sequence?: SortOrder
    address?: SortOrder
    baseTokenAmount?: SortOrder
    baseTokenStakedAmount?: SortOrder
    baseTokenBorrowedAmount?: SortOrder
    quoteTokenAmount?: SortOrder
    quoteTokenStakedAmount?: SortOrder
    quoteTokenBorrowedAmount?: SortOrder
    bidAmount?: SortOrder
    bidPrice?: SortOrder
    bidIsSome?: SortOrder
    askAmount?: SortOrder
    askPrice?: SortOrder
    askIsSome?: SortOrder
    nonce?: SortOrder
  }

  export type StateWhereUniqueInput = Prisma.AtLeast<{
    sequence_address?: StateSequenceAddressCompoundUniqueInput
    AND?: StateWhereInput | StateWhereInput[]
    OR?: StateWhereInput[]
    NOT?: StateWhereInput | StateWhereInput[]
    sequence?: BigIntFilter<"State"> | bigint | number
    address?: StringFilter<"State"> | string
    baseTokenAmount?: BigIntFilter<"State"> | bigint | number
    baseTokenStakedAmount?: BigIntFilter<"State"> | bigint | number
    baseTokenBorrowedAmount?: BigIntFilter<"State"> | bigint | number
    quoteTokenAmount?: BigIntFilter<"State"> | bigint | number
    quoteTokenStakedAmount?: BigIntFilter<"State"> | bigint | number
    quoteTokenBorrowedAmount?: BigIntFilter<"State"> | bigint | number
    bidAmount?: BigIntFilter<"State"> | bigint | number
    bidPrice?: BigIntFilter<"State"> | bigint | number
    bidIsSome?: BoolFilter<"State"> | boolean
    askAmount?: BigIntFilter<"State"> | bigint | number
    askPrice?: BigIntFilter<"State"> | bigint | number
    askIsSome?: BoolFilter<"State"> | boolean
    nonce?: BigIntFilter<"State"> | bigint | number
  }, "sequence_address">

  export type StateOrderByWithAggregationInput = {
    sequence?: SortOrder
    address?: SortOrder
    baseTokenAmount?: SortOrder
    baseTokenStakedAmount?: SortOrder
    baseTokenBorrowedAmount?: SortOrder
    quoteTokenAmount?: SortOrder
    quoteTokenStakedAmount?: SortOrder
    quoteTokenBorrowedAmount?: SortOrder
    bidAmount?: SortOrder
    bidPrice?: SortOrder
    bidIsSome?: SortOrder
    askAmount?: SortOrder
    askPrice?: SortOrder
    askIsSome?: SortOrder
    nonce?: SortOrder
    _count?: StateCountOrderByAggregateInput
    _avg?: StateAvgOrderByAggregateInput
    _max?: StateMaxOrderByAggregateInput
    _min?: StateMinOrderByAggregateInput
    _sum?: StateSumOrderByAggregateInput
  }

  export type StateScalarWhereWithAggregatesInput = {
    AND?: StateScalarWhereWithAggregatesInput | StateScalarWhereWithAggregatesInput[]
    OR?: StateScalarWhereWithAggregatesInput[]
    NOT?: StateScalarWhereWithAggregatesInput | StateScalarWhereWithAggregatesInput[]
    sequence?: BigIntWithAggregatesFilter<"State"> | bigint | number
    address?: StringWithAggregatesFilter<"State"> | string
    baseTokenAmount?: BigIntWithAggregatesFilter<"State"> | bigint | number
    baseTokenStakedAmount?: BigIntWithAggregatesFilter<"State"> | bigint | number
    baseTokenBorrowedAmount?: BigIntWithAggregatesFilter<"State"> | bigint | number
    quoteTokenAmount?: BigIntWithAggregatesFilter<"State"> | bigint | number
    quoteTokenStakedAmount?: BigIntWithAggregatesFilter<"State"> | bigint | number
    quoteTokenBorrowedAmount?: BigIntWithAggregatesFilter<"State"> | bigint | number
    bidAmount?: BigIntWithAggregatesFilter<"State"> | bigint | number
    bidPrice?: BigIntWithAggregatesFilter<"State"> | bigint | number
    bidIsSome?: BoolWithAggregatesFilter<"State"> | boolean
    askAmount?: BigIntWithAggregatesFilter<"State"> | bigint | number
    askPrice?: BigIntWithAggregatesFilter<"State"> | bigint | number
    askIsSome?: BoolWithAggregatesFilter<"State"> | boolean
    nonce?: BigIntWithAggregatesFilter<"State"> | bigint | number
  }

  export type FetchedSequencesWhereInput = {
    AND?: FetchedSequencesWhereInput | FetchedSequencesWhereInput[]
    OR?: FetchedSequencesWhereInput[]
    NOT?: FetchedSequencesWhereInput | FetchedSequencesWhereInput[]
    sequence?: BigIntFilter<"FetchedSequences"> | bigint | number
  }

  export type FetchedSequencesOrderByWithRelationInput = {
    sequence?: SortOrder
  }

  export type FetchedSequencesWhereUniqueInput = Prisma.AtLeast<{
    sequence?: bigint | number
    AND?: FetchedSequencesWhereInput | FetchedSequencesWhereInput[]
    OR?: FetchedSequencesWhereInput[]
    NOT?: FetchedSequencesWhereInput | FetchedSequencesWhereInput[]
  }, "sequence">

  export type FetchedSequencesOrderByWithAggregationInput = {
    sequence?: SortOrder
    _count?: FetchedSequencesCountOrderByAggregateInput
    _avg?: FetchedSequencesAvgOrderByAggregateInput
    _max?: FetchedSequencesMaxOrderByAggregateInput
    _min?: FetchedSequencesMinOrderByAggregateInput
    _sum?: FetchedSequencesSumOrderByAggregateInput
  }

  export type FetchedSequencesScalarWhereWithAggregatesInput = {
    AND?: FetchedSequencesScalarWhereWithAggregatesInput | FetchedSequencesScalarWhereWithAggregatesInput[]
    OR?: FetchedSequencesScalarWhereWithAggregatesInput[]
    NOT?: FetchedSequencesScalarWhereWithAggregatesInput | FetchedSequencesScalarWhereWithAggregatesInput[]
    sequence?: BigIntWithAggregatesFilter<"FetchedSequences"> | bigint | number
  }

  export type ActionRequestWhereInput = {
    AND?: ActionRequestWhereInput | ActionRequestWhereInput[]
    OR?: ActionRequestWhereInput[]
    NOT?: ActionRequestWhereInput | ActionRequestWhereInput[]
    id?: IntFilter<"ActionRequest"> | number
    createdAt?: DateTimeFilter<"ActionRequest"> | Date | string
    operation?: EnumOperationFilter<"ActionRequest"> | $Enums.Operation
    status?: EnumActionStatusFilter<"ActionRequest"> | $Enums.ActionStatus
    address?: StringNullableFilter<"ActionRequest"> | string | null
    poolPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    publicKey?: StringNullableFilter<"ActionRequest"> | string | null
    publicKeyBase58?: StringNullableFilter<"ActionRequest"> | string | null
    name?: StringNullableFilter<"ActionRequest"> | string | null
    role?: StringNullableFilter<"ActionRequest"> | string | null
    image?: StringNullableFilter<"ActionRequest"> | string | null
    baseBalance?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    quoteBalance?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    userPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    baseTokenAmount?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    price?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    isSome?: BoolNullableFilter<"ActionRequest"> | boolean | null
    nonce?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    userSignatureR?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    userSignatureS?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    buyerPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    sellerPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    quoteTokenAmount?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    buyerNonce?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    sellerNonce?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    senderPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    receiverPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    senderNonce?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    receiverNonce?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    senderSignatureR?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    senderSignatureS?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
  }

  export type ActionRequestOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    operation?: SortOrder
    status?: SortOrder
    address?: SortOrderInput | SortOrder
    poolPublicKey?: SortOrderInput | SortOrder
    publicKey?: SortOrderInput | SortOrder
    publicKeyBase58?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    baseBalance?: SortOrderInput | SortOrder
    quoteBalance?: SortOrderInput | SortOrder
    userPublicKey?: SortOrderInput | SortOrder
    baseTokenAmount?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    isSome?: SortOrderInput | SortOrder
    nonce?: SortOrderInput | SortOrder
    userSignatureR?: SortOrderInput | SortOrder
    userSignatureS?: SortOrderInput | SortOrder
    buyerPublicKey?: SortOrderInput | SortOrder
    sellerPublicKey?: SortOrderInput | SortOrder
    quoteTokenAmount?: SortOrderInput | SortOrder
    buyerNonce?: SortOrderInput | SortOrder
    sellerNonce?: SortOrderInput | SortOrder
    senderPublicKey?: SortOrderInput | SortOrder
    receiverPublicKey?: SortOrderInput | SortOrder
    senderNonce?: SortOrderInput | SortOrder
    receiverNonce?: SortOrderInput | SortOrder
    senderSignatureR?: SortOrderInput | SortOrder
    senderSignatureS?: SortOrderInput | SortOrder
  }

  export type ActionRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ActionRequestWhereInput | ActionRequestWhereInput[]
    OR?: ActionRequestWhereInput[]
    NOT?: ActionRequestWhereInput | ActionRequestWhereInput[]
    createdAt?: DateTimeFilter<"ActionRequest"> | Date | string
    operation?: EnumOperationFilter<"ActionRequest"> | $Enums.Operation
    status?: EnumActionStatusFilter<"ActionRequest"> | $Enums.ActionStatus
    address?: StringNullableFilter<"ActionRequest"> | string | null
    poolPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    publicKey?: StringNullableFilter<"ActionRequest"> | string | null
    publicKeyBase58?: StringNullableFilter<"ActionRequest"> | string | null
    name?: StringNullableFilter<"ActionRequest"> | string | null
    role?: StringNullableFilter<"ActionRequest"> | string | null
    image?: StringNullableFilter<"ActionRequest"> | string | null
    baseBalance?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    quoteBalance?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    userPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    baseTokenAmount?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    price?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    isSome?: BoolNullableFilter<"ActionRequest"> | boolean | null
    nonce?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    userSignatureR?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    userSignatureS?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    buyerPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    sellerPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    quoteTokenAmount?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    buyerNonce?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    sellerNonce?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    senderPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    receiverPublicKey?: StringNullableFilter<"ActionRequest"> | string | null
    senderNonce?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    receiverNonce?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    senderSignatureR?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
    senderSignatureS?: BigIntNullableFilter<"ActionRequest"> | bigint | number | null
  }, "id">

  export type ActionRequestOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    operation?: SortOrder
    status?: SortOrder
    address?: SortOrderInput | SortOrder
    poolPublicKey?: SortOrderInput | SortOrder
    publicKey?: SortOrderInput | SortOrder
    publicKeyBase58?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    baseBalance?: SortOrderInput | SortOrder
    quoteBalance?: SortOrderInput | SortOrder
    userPublicKey?: SortOrderInput | SortOrder
    baseTokenAmount?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    isSome?: SortOrderInput | SortOrder
    nonce?: SortOrderInput | SortOrder
    userSignatureR?: SortOrderInput | SortOrder
    userSignatureS?: SortOrderInput | SortOrder
    buyerPublicKey?: SortOrderInput | SortOrder
    sellerPublicKey?: SortOrderInput | SortOrder
    quoteTokenAmount?: SortOrderInput | SortOrder
    buyerNonce?: SortOrderInput | SortOrder
    sellerNonce?: SortOrderInput | SortOrder
    senderPublicKey?: SortOrderInput | SortOrder
    receiverPublicKey?: SortOrderInput | SortOrder
    senderNonce?: SortOrderInput | SortOrder
    receiverNonce?: SortOrderInput | SortOrder
    senderSignatureR?: SortOrderInput | SortOrder
    senderSignatureS?: SortOrderInput | SortOrder
    _count?: ActionRequestCountOrderByAggregateInput
    _avg?: ActionRequestAvgOrderByAggregateInput
    _max?: ActionRequestMaxOrderByAggregateInput
    _min?: ActionRequestMinOrderByAggregateInput
    _sum?: ActionRequestSumOrderByAggregateInput
  }

  export type ActionRequestScalarWhereWithAggregatesInput = {
    AND?: ActionRequestScalarWhereWithAggregatesInput | ActionRequestScalarWhereWithAggregatesInput[]
    OR?: ActionRequestScalarWhereWithAggregatesInput[]
    NOT?: ActionRequestScalarWhereWithAggregatesInput | ActionRequestScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ActionRequest"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ActionRequest"> | Date | string
    operation?: EnumOperationWithAggregatesFilter<"ActionRequest"> | $Enums.Operation
    status?: EnumActionStatusWithAggregatesFilter<"ActionRequest"> | $Enums.ActionStatus
    address?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    poolPublicKey?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    publicKey?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    publicKeyBase58?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    name?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    role?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    image?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    baseBalance?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    quoteBalance?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    userPublicKey?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    baseTokenAmount?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    price?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    isSome?: BoolNullableWithAggregatesFilter<"ActionRequest"> | boolean | null
    nonce?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    userSignatureR?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    userSignatureS?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    buyerPublicKey?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    sellerPublicKey?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    quoteTokenAmount?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    buyerNonce?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    sellerNonce?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    senderPublicKey?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    receiverPublicKey?: StringNullableWithAggregatesFilter<"ActionRequest"> | string | null
    senderNonce?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    receiverNonce?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    senderSignatureR?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
    senderSignatureS?: BigIntNullableWithAggregatesFilter<"ActionRequest"> | bigint | number | null
  }

  export type StateCreateInput = {
    sequence: bigint | number
    address: string
    baseTokenAmount: bigint | number
    baseTokenStakedAmount: bigint | number
    baseTokenBorrowedAmount: bigint | number
    quoteTokenAmount: bigint | number
    quoteTokenStakedAmount: bigint | number
    quoteTokenBorrowedAmount: bigint | number
    bidAmount: bigint | number
    bidPrice: bigint | number
    bidIsSome: boolean
    askAmount: bigint | number
    askPrice: bigint | number
    askIsSome: boolean
    nonce: bigint | number
  }

  export type StateUncheckedCreateInput = {
    sequence: bigint | number
    address: string
    baseTokenAmount: bigint | number
    baseTokenStakedAmount: bigint | number
    baseTokenBorrowedAmount: bigint | number
    quoteTokenAmount: bigint | number
    quoteTokenStakedAmount: bigint | number
    quoteTokenBorrowedAmount: bigint | number
    bidAmount: bigint | number
    bidPrice: bigint | number
    bidIsSome: boolean
    askAmount: bigint | number
    askPrice: bigint | number
    askIsSome: boolean
    nonce: bigint | number
  }

  export type StateUpdateInput = {
    sequence?: BigIntFieldUpdateOperationsInput | bigint | number
    address?: StringFieldUpdateOperationsInput | string
    baseTokenAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    baseTokenStakedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    baseTokenBorrowedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenStakedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenBorrowedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    bidAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    bidPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    bidIsSome?: BoolFieldUpdateOperationsInput | boolean
    askAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    askPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    askIsSome?: BoolFieldUpdateOperationsInput | boolean
    nonce?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type StateUncheckedUpdateInput = {
    sequence?: BigIntFieldUpdateOperationsInput | bigint | number
    address?: StringFieldUpdateOperationsInput | string
    baseTokenAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    baseTokenStakedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    baseTokenBorrowedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenStakedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenBorrowedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    bidAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    bidPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    bidIsSome?: BoolFieldUpdateOperationsInput | boolean
    askAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    askPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    askIsSome?: BoolFieldUpdateOperationsInput | boolean
    nonce?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type StateCreateManyInput = {
    sequence: bigint | number
    address: string
    baseTokenAmount: bigint | number
    baseTokenStakedAmount: bigint | number
    baseTokenBorrowedAmount: bigint | number
    quoteTokenAmount: bigint | number
    quoteTokenStakedAmount: bigint | number
    quoteTokenBorrowedAmount: bigint | number
    bidAmount: bigint | number
    bidPrice: bigint | number
    bidIsSome: boolean
    askAmount: bigint | number
    askPrice: bigint | number
    askIsSome: boolean
    nonce: bigint | number
  }

  export type StateUpdateManyMutationInput = {
    sequence?: BigIntFieldUpdateOperationsInput | bigint | number
    address?: StringFieldUpdateOperationsInput | string
    baseTokenAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    baseTokenStakedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    baseTokenBorrowedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenStakedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenBorrowedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    bidAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    bidPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    bidIsSome?: BoolFieldUpdateOperationsInput | boolean
    askAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    askPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    askIsSome?: BoolFieldUpdateOperationsInput | boolean
    nonce?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type StateUncheckedUpdateManyInput = {
    sequence?: BigIntFieldUpdateOperationsInput | bigint | number
    address?: StringFieldUpdateOperationsInput | string
    baseTokenAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    baseTokenStakedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    baseTokenBorrowedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenStakedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    quoteTokenBorrowedAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    bidAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    bidPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    bidIsSome?: BoolFieldUpdateOperationsInput | boolean
    askAmount?: BigIntFieldUpdateOperationsInput | bigint | number
    askPrice?: BigIntFieldUpdateOperationsInput | bigint | number
    askIsSome?: BoolFieldUpdateOperationsInput | boolean
    nonce?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type FetchedSequencesCreateInput = {
    sequence: bigint | number
  }

  export type FetchedSequencesUncheckedCreateInput = {
    sequence: bigint | number
  }

  export type FetchedSequencesUpdateInput = {
    sequence?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type FetchedSequencesUncheckedUpdateInput = {
    sequence?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type FetchedSequencesCreateManyInput = {
    sequence: bigint | number
  }

  export type FetchedSequencesUpdateManyMutationInput = {
    sequence?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type FetchedSequencesUncheckedUpdateManyInput = {
    sequence?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ActionRequestCreateInput = {
    createdAt?: Date | string
    operation: $Enums.Operation
    status?: $Enums.ActionStatus
    address?: string | null
    poolPublicKey?: string | null
    publicKey?: string | null
    publicKeyBase58?: string | null
    name?: string | null
    role?: string | null
    image?: string | null
    baseBalance?: bigint | number | null
    quoteBalance?: bigint | number | null
    userPublicKey?: string | null
    baseTokenAmount?: bigint | number | null
    price?: bigint | number | null
    isSome?: boolean | null
    nonce?: bigint | number | null
    userSignatureR?: bigint | number | null
    userSignatureS?: bigint | number | null
    buyerPublicKey?: string | null
    sellerPublicKey?: string | null
    quoteTokenAmount?: bigint | number | null
    buyerNonce?: bigint | number | null
    sellerNonce?: bigint | number | null
    senderPublicKey?: string | null
    receiverPublicKey?: string | null
    senderNonce?: bigint | number | null
    receiverNonce?: bigint | number | null
    senderSignatureR?: bigint | number | null
    senderSignatureS?: bigint | number | null
  }

  export type ActionRequestUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    operation: $Enums.Operation
    status?: $Enums.ActionStatus
    address?: string | null
    poolPublicKey?: string | null
    publicKey?: string | null
    publicKeyBase58?: string | null
    name?: string | null
    role?: string | null
    image?: string | null
    baseBalance?: bigint | number | null
    quoteBalance?: bigint | number | null
    userPublicKey?: string | null
    baseTokenAmount?: bigint | number | null
    price?: bigint | number | null
    isSome?: boolean | null
    nonce?: bigint | number | null
    userSignatureR?: bigint | number | null
    userSignatureS?: bigint | number | null
    buyerPublicKey?: string | null
    sellerPublicKey?: string | null
    quoteTokenAmount?: bigint | number | null
    buyerNonce?: bigint | number | null
    sellerNonce?: bigint | number | null
    senderPublicKey?: string | null
    receiverPublicKey?: string | null
    senderNonce?: bigint | number | null
    receiverNonce?: bigint | number | null
    senderSignatureR?: bigint | number | null
    senderSignatureS?: bigint | number | null
  }

  export type ActionRequestUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    operation?: EnumOperationFieldUpdateOperationsInput | $Enums.Operation
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    address?: NullableStringFieldUpdateOperationsInput | string | null
    poolPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKeyBase58?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    baseBalance?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    quoteBalance?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    baseTokenAmount?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    price?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    isSome?: NullableBoolFieldUpdateOperationsInput | boolean | null
    nonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userSignatureR?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userSignatureS?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    buyerPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    sellerPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    quoteTokenAmount?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    buyerNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    sellerNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    receiverPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    senderNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    receiverNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderSignatureR?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderSignatureS?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type ActionRequestUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    operation?: EnumOperationFieldUpdateOperationsInput | $Enums.Operation
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    address?: NullableStringFieldUpdateOperationsInput | string | null
    poolPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKeyBase58?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    baseBalance?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    quoteBalance?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    baseTokenAmount?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    price?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    isSome?: NullableBoolFieldUpdateOperationsInput | boolean | null
    nonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userSignatureR?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userSignatureS?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    buyerPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    sellerPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    quoteTokenAmount?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    buyerNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    sellerNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    receiverPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    senderNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    receiverNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderSignatureR?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderSignatureS?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type ActionRequestCreateManyInput = {
    id?: number
    createdAt?: Date | string
    operation: $Enums.Operation
    status?: $Enums.ActionStatus
    address?: string | null
    poolPublicKey?: string | null
    publicKey?: string | null
    publicKeyBase58?: string | null
    name?: string | null
    role?: string | null
    image?: string | null
    baseBalance?: bigint | number | null
    quoteBalance?: bigint | number | null
    userPublicKey?: string | null
    baseTokenAmount?: bigint | number | null
    price?: bigint | number | null
    isSome?: boolean | null
    nonce?: bigint | number | null
    userSignatureR?: bigint | number | null
    userSignatureS?: bigint | number | null
    buyerPublicKey?: string | null
    sellerPublicKey?: string | null
    quoteTokenAmount?: bigint | number | null
    buyerNonce?: bigint | number | null
    sellerNonce?: bigint | number | null
    senderPublicKey?: string | null
    receiverPublicKey?: string | null
    senderNonce?: bigint | number | null
    receiverNonce?: bigint | number | null
    senderSignatureR?: bigint | number | null
    senderSignatureS?: bigint | number | null
  }

  export type ActionRequestUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    operation?: EnumOperationFieldUpdateOperationsInput | $Enums.Operation
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    address?: NullableStringFieldUpdateOperationsInput | string | null
    poolPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKeyBase58?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    baseBalance?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    quoteBalance?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    baseTokenAmount?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    price?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    isSome?: NullableBoolFieldUpdateOperationsInput | boolean | null
    nonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userSignatureR?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userSignatureS?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    buyerPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    sellerPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    quoteTokenAmount?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    buyerNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    sellerNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    receiverPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    senderNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    receiverNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderSignatureR?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderSignatureS?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type ActionRequestUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    operation?: EnumOperationFieldUpdateOperationsInput | $Enums.Operation
    status?: EnumActionStatusFieldUpdateOperationsInput | $Enums.ActionStatus
    address?: NullableStringFieldUpdateOperationsInput | string | null
    poolPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    publicKeyBase58?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    baseBalance?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    quoteBalance?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    baseTokenAmount?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    price?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    isSome?: NullableBoolFieldUpdateOperationsInput | boolean | null
    nonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userSignatureR?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    userSignatureS?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    buyerPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    sellerPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    quoteTokenAmount?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    buyerNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    sellerNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    receiverPublicKey?: NullableStringFieldUpdateOperationsInput | string | null
    senderNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    receiverNonce?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderSignatureR?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    senderSignatureS?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StateSequenceAddressCompoundUniqueInput = {
    sequence: bigint | number
    address: string
  }

  export type StateCountOrderByAggregateInput = {
    sequence?: SortOrder
    address?: SortOrder
    baseTokenAmount?: SortOrder
    baseTokenStakedAmount?: SortOrder
    baseTokenBorrowedAmount?: SortOrder
    quoteTokenAmount?: SortOrder
    quoteTokenStakedAmount?: SortOrder
    quoteTokenBorrowedAmount?: SortOrder
    bidAmount?: SortOrder
    bidPrice?: SortOrder
    bidIsSome?: SortOrder
    askAmount?: SortOrder
    askPrice?: SortOrder
    askIsSome?: SortOrder
    nonce?: SortOrder
  }

  export type StateAvgOrderByAggregateInput = {
    sequence?: SortOrder
    baseTokenAmount?: SortOrder
    baseTokenStakedAmount?: SortOrder
    baseTokenBorrowedAmount?: SortOrder
    quoteTokenAmount?: SortOrder
    quoteTokenStakedAmount?: SortOrder
    quoteTokenBorrowedAmount?: SortOrder
    bidAmount?: SortOrder
    bidPrice?: SortOrder
    askAmount?: SortOrder
    askPrice?: SortOrder
    nonce?: SortOrder
  }

  export type StateMaxOrderByAggregateInput = {
    sequence?: SortOrder
    address?: SortOrder
    baseTokenAmount?: SortOrder
    baseTokenStakedAmount?: SortOrder
    baseTokenBorrowedAmount?: SortOrder
    quoteTokenAmount?: SortOrder
    quoteTokenStakedAmount?: SortOrder
    quoteTokenBorrowedAmount?: SortOrder
    bidAmount?: SortOrder
    bidPrice?: SortOrder
    bidIsSome?: SortOrder
    askAmount?: SortOrder
    askPrice?: SortOrder
    askIsSome?: SortOrder
    nonce?: SortOrder
  }

  export type StateMinOrderByAggregateInput = {
    sequence?: SortOrder
    address?: SortOrder
    baseTokenAmount?: SortOrder
    baseTokenStakedAmount?: SortOrder
    baseTokenBorrowedAmount?: SortOrder
    quoteTokenAmount?: SortOrder
    quoteTokenStakedAmount?: SortOrder
    quoteTokenBorrowedAmount?: SortOrder
    bidAmount?: SortOrder
    bidPrice?: SortOrder
    bidIsSome?: SortOrder
    askAmount?: SortOrder
    askPrice?: SortOrder
    askIsSome?: SortOrder
    nonce?: SortOrder
  }

  export type StateSumOrderByAggregateInput = {
    sequence?: SortOrder
    baseTokenAmount?: SortOrder
    baseTokenStakedAmount?: SortOrder
    baseTokenBorrowedAmount?: SortOrder
    quoteTokenAmount?: SortOrder
    quoteTokenStakedAmount?: SortOrder
    quoteTokenBorrowedAmount?: SortOrder
    bidAmount?: SortOrder
    bidPrice?: SortOrder
    askAmount?: SortOrder
    askPrice?: SortOrder
    nonce?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FetchedSequencesCountOrderByAggregateInput = {
    sequence?: SortOrder
  }

  export type FetchedSequencesAvgOrderByAggregateInput = {
    sequence?: SortOrder
  }

  export type FetchedSequencesMaxOrderByAggregateInput = {
    sequence?: SortOrder
  }

  export type FetchedSequencesMinOrderByAggregateInput = {
    sequence?: SortOrder
  }

  export type FetchedSequencesSumOrderByAggregateInput = {
    sequence?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumOperationFilter<$PrismaModel = never> = {
    equals?: $Enums.Operation | EnumOperationFieldRefInput<$PrismaModel>
    in?: $Enums.Operation[] | ListEnumOperationFieldRefInput<$PrismaModel>
    notIn?: $Enums.Operation[] | ListEnumOperationFieldRefInput<$PrismaModel>
    not?: NestedEnumOperationFilter<$PrismaModel> | $Enums.Operation
  }

  export type EnumActionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionStatus | EnumActionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumActionStatusFilter<$PrismaModel> | $Enums.ActionStatus
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ActionRequestCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    operation?: SortOrder
    status?: SortOrder
    address?: SortOrder
    poolPublicKey?: SortOrder
    publicKey?: SortOrder
    publicKeyBase58?: SortOrder
    name?: SortOrder
    role?: SortOrder
    image?: SortOrder
    baseBalance?: SortOrder
    quoteBalance?: SortOrder
    userPublicKey?: SortOrder
    baseTokenAmount?: SortOrder
    price?: SortOrder
    isSome?: SortOrder
    nonce?: SortOrder
    userSignatureR?: SortOrder
    userSignatureS?: SortOrder
    buyerPublicKey?: SortOrder
    sellerPublicKey?: SortOrder
    quoteTokenAmount?: SortOrder
    buyerNonce?: SortOrder
    sellerNonce?: SortOrder
    senderPublicKey?: SortOrder
    receiverPublicKey?: SortOrder
    senderNonce?: SortOrder
    receiverNonce?: SortOrder
    senderSignatureR?: SortOrder
    senderSignatureS?: SortOrder
  }

  export type ActionRequestAvgOrderByAggregateInput = {
    id?: SortOrder
    baseBalance?: SortOrder
    quoteBalance?: SortOrder
    baseTokenAmount?: SortOrder
    price?: SortOrder
    nonce?: SortOrder
    userSignatureR?: SortOrder
    userSignatureS?: SortOrder
    quoteTokenAmount?: SortOrder
    buyerNonce?: SortOrder
    sellerNonce?: SortOrder
    senderNonce?: SortOrder
    receiverNonce?: SortOrder
    senderSignatureR?: SortOrder
    senderSignatureS?: SortOrder
  }

  export type ActionRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    operation?: SortOrder
    status?: SortOrder
    address?: SortOrder
    poolPublicKey?: SortOrder
    publicKey?: SortOrder
    publicKeyBase58?: SortOrder
    name?: SortOrder
    role?: SortOrder
    image?: SortOrder
    baseBalance?: SortOrder
    quoteBalance?: SortOrder
    userPublicKey?: SortOrder
    baseTokenAmount?: SortOrder
    price?: SortOrder
    isSome?: SortOrder
    nonce?: SortOrder
    userSignatureR?: SortOrder
    userSignatureS?: SortOrder
    buyerPublicKey?: SortOrder
    sellerPublicKey?: SortOrder
    quoteTokenAmount?: SortOrder
    buyerNonce?: SortOrder
    sellerNonce?: SortOrder
    senderPublicKey?: SortOrder
    receiverPublicKey?: SortOrder
    senderNonce?: SortOrder
    receiverNonce?: SortOrder
    senderSignatureR?: SortOrder
    senderSignatureS?: SortOrder
  }

  export type ActionRequestMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    operation?: SortOrder
    status?: SortOrder
    address?: SortOrder
    poolPublicKey?: SortOrder
    publicKey?: SortOrder
    publicKeyBase58?: SortOrder
    name?: SortOrder
    role?: SortOrder
    image?: SortOrder
    baseBalance?: SortOrder
    quoteBalance?: SortOrder
    userPublicKey?: SortOrder
    baseTokenAmount?: SortOrder
    price?: SortOrder
    isSome?: SortOrder
    nonce?: SortOrder
    userSignatureR?: SortOrder
    userSignatureS?: SortOrder
    buyerPublicKey?: SortOrder
    sellerPublicKey?: SortOrder
    quoteTokenAmount?: SortOrder
    buyerNonce?: SortOrder
    sellerNonce?: SortOrder
    senderPublicKey?: SortOrder
    receiverPublicKey?: SortOrder
    senderNonce?: SortOrder
    receiverNonce?: SortOrder
    senderSignatureR?: SortOrder
    senderSignatureS?: SortOrder
  }

  export type ActionRequestSumOrderByAggregateInput = {
    id?: SortOrder
    baseBalance?: SortOrder
    quoteBalance?: SortOrder
    baseTokenAmount?: SortOrder
    price?: SortOrder
    nonce?: SortOrder
    userSignatureR?: SortOrder
    userSignatureS?: SortOrder
    quoteTokenAmount?: SortOrder
    buyerNonce?: SortOrder
    sellerNonce?: SortOrder
    senderNonce?: SortOrder
    receiverNonce?: SortOrder
    senderSignatureR?: SortOrder
    senderSignatureS?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumOperationWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Operation | EnumOperationFieldRefInput<$PrismaModel>
    in?: $Enums.Operation[] | ListEnumOperationFieldRefInput<$PrismaModel>
    notIn?: $Enums.Operation[] | ListEnumOperationFieldRefInput<$PrismaModel>
    not?: NestedEnumOperationWithAggregatesFilter<$PrismaModel> | $Enums.Operation
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOperationFilter<$PrismaModel>
    _max?: NestedEnumOperationFilter<$PrismaModel>
  }

  export type EnumActionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionStatus | EnumActionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumActionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ActionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActionStatusFilter<$PrismaModel>
    _max?: NestedEnumActionStatusFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumOperationFieldUpdateOperationsInput = {
    set?: $Enums.Operation
  }

  export type EnumActionStatusFieldUpdateOperationsInput = {
    set?: $Enums.ActionStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumOperationFilter<$PrismaModel = never> = {
    equals?: $Enums.Operation | EnumOperationFieldRefInput<$PrismaModel>
    in?: $Enums.Operation[] | ListEnumOperationFieldRefInput<$PrismaModel>
    notIn?: $Enums.Operation[] | ListEnumOperationFieldRefInput<$PrismaModel>
    not?: NestedEnumOperationFilter<$PrismaModel> | $Enums.Operation
  }

  export type NestedEnumActionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionStatus | EnumActionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumActionStatusFilter<$PrismaModel> | $Enums.ActionStatus
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumOperationWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Operation | EnumOperationFieldRefInput<$PrismaModel>
    in?: $Enums.Operation[] | ListEnumOperationFieldRefInput<$PrismaModel>
    notIn?: $Enums.Operation[] | ListEnumOperationFieldRefInput<$PrismaModel>
    not?: NestedEnumOperationWithAggregatesFilter<$PrismaModel> | $Enums.Operation
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOperationFilter<$PrismaModel>
    _max?: NestedEnumOperationFilter<$PrismaModel>
  }

  export type NestedEnumActionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActionStatus | EnumActionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ActionStatus[] | ListEnumActionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumActionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ActionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumActionStatusFilter<$PrismaModel>
    _max?: NestedEnumActionStatusFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}