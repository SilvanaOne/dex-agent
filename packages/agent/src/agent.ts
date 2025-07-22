import { zkCloudWorker, Cloud, sleep } from "@silvana-one/prover";
import { JobResult } from "@silvana-one/api";
import { VerificationKey, Cache } from "o1js";
import {
  prove,
  merge,
  settle,
  monitor,
  fetchAccountProof,
  fetchSequenceData,
} from "@dex-agent/contracts";
import {
  agentSettle,
  sqlActionRequestQuery,
  isSequenceFetched,
  addSequenceData,
  agentSqlProcessing,
  processSqlRequests,
  LastTransactionData,
  setSqlRequestStatus,
  returnUserKey,
} from "@dex-agent/lib";

const MAX_RUN_TIME = 1000 * 60 * 5; // 5 minutes

export class DEXAgent extends zkCloudWorker {
  static verificationKeys: {
    [key: string]: VerificationKey;
  } = {};

  readonly cache: Cache;

  constructor(cloud: Cloud) {
    super(cloud);
    this.cache = Cache.FileSystem(this.cloud.cache);
  }

  private async compile(params: { compileContract?: boolean }): Promise<void> {
    console.log("Compile", params);
    const { compileContract = false } = params;
    try {
      console.time("compiled");

      console.timeEnd("compiled");
    } catch (error) {
      console.error("Error in compile, restarting container", error);
      // Restarting the container, see https://github.com/o1-labs/o1js/issues/1651
      await this.cloud.forceWorkerRestart();
      throw error;
    }
  }

  public async create(transaction: string): Promise<string | undefined> {
    throw new Error("Method not implemented.");
  }

  public async merge(
    proof1: string,
    proof2: string
  ): Promise<string | undefined> {
    throw new Error("Method not implemented.");
  }

  public async execute(transactions: string[]): Promise<string | undefined> {
    //if (transactions.length === 0) throw new Error("transactions is empty");
    const { task } = this.cloud;
    if (
      task !== "prove" &&
      task !== "merge" &&
      task !== "settle" &&
      task !== "monitor" &&
      task !== "proveAccount" &&
      task !== "sqlRequest" &&
      task !== "sqlProcessing"
    )
      throw new Error("Invalid task");
    let result: string | undefined = undefined;
    try {
      switch (task) {
        case "prove":
          result = await this.proveDex();
          break;
        case "merge":
          result = await this.mergeDex();
          break;
        case "settle":
          result = await this.settleDex();
          break;
        case "monitor":
          result = await this.monitorDex(undefined);
          break;
        case "proveAccount":
          result = await this.proveAccount();
          break;
        case "sqlRequest":
          result = await this.sqlRequest();
          break;
        case "sqlProcessing":
          result = await this.sqlProcessing();
          break;
      }
      await returnUserKey();
      return (
        result ??
        this.stringifyJobResult({
          success: false,
          error: "no result",
        })
      );
    } catch (error: any) {
      console.error(`Error in ${task}`, error.message);
      await returnUserKey();
      return this.stringifyJobResult({
        success: false,
        error: String(error.message),
      });
    }
  }
  private stringifyJobResult(
    result: JobResult & { blobId?: string; result?: object | string }
  ): string {
    /*
        export interface JobResult {
          success: boolean;
          error?: string;
          tx?: string;
          hash?: string;
          jobStatus?: string;
        }
    */
    const strippedResult = {
      ...result,
      tx: result.hash ? undefined : result.tx,
      task: this.cloud.task,
    };
    return JSON.stringify(
      strippedResult,
      (key, value) => (typeof value === "bigint" ? value.toString() : value),
      2
    );
  }

  private async proveDex(): Promise<string> {
    // return this.stringifyJobResult({
    //   success: true,
    // });
    console.time("proveDex");
    const result = await prove({
      jobId: this.cloud.jobId,
      endTime: Date.now() + MAX_RUN_TIME,
      cache: this.cache,
    });
    console.log("proveDex result", result);
    await this.cloud.publishTransactionMetadata({
      metadata: result.metadata,
    });
    console.timeEnd("proveDex");
    return this.stringifyJobResult({
      success: true,
    });
  }

  private async mergeDex(): Promise<string> {
    // return this.stringifyJobResult({
    //   success: true,
    // });
    console.time("mergeDex");
    const result = await merge({
      jobId: this.cloud.jobId,
      endTime: Date.now() + MAX_RUN_TIME,
      cache: this.cache,
    });
    console.log("mergeDex result", result);
    await this.cloud.publishTransactionMetadata({
      metadata: result.metadata,
    });
    console.timeEnd("mergeDex");
    return this.stringifyJobResult({
      success: true,
    });
  }

  private async settleDex(): Promise<string> {
    let restart = false;
    if (await this.run()) {
      try {
        const nonce = await this.getNonce();
        const result = await settle({
          jobId: this.cloud.jobId,
          endTime: Date.now() + MAX_RUN_TIME,
          cache: this.cache,
          nonce,
          chain: this.cloud.chain as "devnet" | "zeko" | "mainnet",
        });
        await this.saveNonce(result.nonce);
        restart = result.restart;
        console.log("settleDex result", result);
        await this.cloud.publishTransactionMetadata({
          metadata: result.metadata,
        });
      } catch (error) {
        console.error("Error in settleDex", error);
      } finally {
        await this.stop();
        if (restart) {
          console.log("Restarting settle agent");
          await sleep(1000);
          await agentSettle();
        }
        return this.stringifyJobResult({
          success: true,
        });
      }
    } else {
      return this.stringifyJobResult({
        success: true,
      });
    }
  }

  private async proveAccount(): Promise<string> {
    console.time("proveAccount");
    try {
      const args = this.cloud.args ? JSON.parse(this.cloud.args) : undefined;
      const address = args?.address;
      if (!address) throw new Error("address is not set");
      const sequence = args?.sequence;
      if (!sequence) throw new Error("sequence is not set");
      const blockNumber = args?.blockNumber;
      if (!blockNumber) throw new Error("blockNumber is not set");
      const sqlId: number | undefined =
        args?.sqlId && typeof args.sqlId === "number" ? args.sqlId : undefined;
      const result = await fetchAccountProof({
        jobId: this.cloud.jobId,
        cache: this.cache,
        address,
        sequence,
        blockNumber,
        sqlId,
      });

      console.log("proveAccount result", result);
      if (!result) throw new Error("cannot create proof");

      await this.cloud.publishTransactionMetadata({
        txId: "dex:proveAccount:" + this.cloud.jobId,
        metadata: {
          custom: {
            task: "prove account",
            blobId: result,
          },
        },
      });

      console.timeEnd("proveAccount");
      return this.stringifyJobResult({
        success: true,
        blobId: result,
      });
    } catch (error: any) {
      console.timeEnd("proveAccount");
      console.error("Error in proveAccount", error.message);
      return this.stringifyJobResult({
        success: false,
        error: String(error.message),
      });
    }
  }

  private async sqlRequest(): Promise<string> {
    console.time("sqlRequest");
    try {
      const args = this.cloud.args ? JSON.parse(this.cloud.args) : undefined;
      const query = args?.query;
      if (!query) throw new Error("query is not set");
      const sequence = args?.sequence;
      if (!sequence) throw new Error("sequence is not set");
      const blockNumber = args?.blockNumber;
      if (!blockNumber) throw new Error("blockNumber is not set");
      const isFetched = await isSequenceFetched(sequence);
      if (!isFetched) {
        console.log(
          `sqlRequest: sequence is not fetched, fetching sequence ${sequence} for block ${blockNumber}`
        );
        const sequenceData = await fetchSequenceData({
          sequence,
          blockNumber,
          prove: false,
          cache: this.cache,
        });
        if (!sequenceData || !sequenceData.state)
          throw new Error("cannot fetch sequence data");
        await addSequenceData({
          sequence,
          state: Object.entries(sequenceData.state.accounts).reduce(
            (acc, [address, account]) => {
              acc[address] = account.toAccountData();
              return acc;
            },
            {} as Record<string, any>
          ),
        });
      }
      let queryResult:
        | {
            success: boolean;
            data: unknown;
            error: string | undefined;
          }
        | undefined = undefined;
      try {
        queryResult = await sqlActionRequestQuery(query);
        console.log("sqlRequest result", queryResult);
      } catch (error: any) {
        console.error("Error in sqlRequest", error.message);
        queryResult = {
          success: false,
          data: undefined,
          error: String(error.message),
        };
      }
      let processedResult:
        | (Partial<LastTransactionData> | { jobId: string })[]
        | undefined = undefined;
      if (queryResult?.success) {
        try {
          processedResult = await processSqlRequests({
            jobId: this.cloud.jobId,
          });
          console.log("sqlProcessing result", processedResult);
        } catch (error: any) {
          console.error("Error in sqlProcessing", error.message);
          processedResult = [
            {
              errors: [
                {
                  code: "sql_processing_error",
                  message: String(error.message),
                  severity: "error",
                },
              ],
            },
          ];
        }
      }
      const queryResultString = JSON.stringify(
        queryResult ?? { error: "cannot execute SQL request" },
        (key, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      );
      const processedResultString = JSON.stringify(
        processedResult ?? [
          {
            errors: [
              {
                code: "sql_processing_error",
                message: "cannot process SQL request",
                severity: "error",
              },
            ],
          },
        ],
        (key, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      );
      //console.log("sqlRequest resultString", resultString);

      await this.cloud.publishTransactionMetadata({
        txId: "dex:sqlRequest:" + this.cloud.jobId,
        metadata: {
          custom: {
            task: "SQL request",
            query,
            result: {
              query: queryResultString,
              processed: processedResultString,
              itemsProcessed: processedResult?.length ?? 0,
            },
          },
        },
      });

      console.timeEnd("sqlRequest");
      return this.stringifyJobResult({
        success: true,
        result: { query: queryResultString, processed: processedResultString },
      });
    } catch (error: any) {
      console.error("Error in sqlRequest", error.message);
      console.timeEnd("sqlRequest");
      return this.stringifyJobResult({
        success: false,
        error: String(error.message),
      });
    }
  }

  private async sqlProcessing(): Promise<string> {
    console.time("sqlProcessing");
    try {
      const result = await processSqlRequests({
        jobId: this.cloud.jobId,
      });

      console.log("sqlProcessing result", result);
      if (!result) throw new Error("cannot execute SQL request");
      const resultString = JSON.stringify(
        result,
        (key, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      );

      await this.cloud.publishTransactionMetadata({
        txId: "dex:sqlProcessing:" + this.cloud.jobId,
        metadata: {
          custom: {
            task: "SQL processing",
            itemsProcessed: result.length,
            result: resultString,
          },
        },
      });

      console.timeEnd("sqlProcessing");
      return this.stringifyJobResult({
        success: true,
        result: resultString,
      });
    } catch (error: any) {
      console.error("Error in sqlProcessing", error.message);
      console.timeEnd("sqlProcessing");
      return this.stringifyJobResult({
        success: false,
        error: String(error.message),
      });
    }
  }

  public async task(): Promise<string | undefined> {
    if (this.cloud.task === undefined) throw new Error("task is undefined");
    console.log(
      `Executing task ${this.cloud.task} with taskId ${this.cloud.taskId}`
    );
    try {
      switch (this.cloud.task) {
        case "monitor":
          await this.monitorDex(this.cloud.taskId);
          break;

        default:
          console.error("Unknown task in task:", this.cloud.task);
      }
      return `task ${this.cloud.task} executed`;
    } catch (error: any) {
      console.error("Error in task", error.message);
      return "error in task";
    }
  }

  private async monitorDex(taskId: string | undefined): Promise<string> {
    if (taskId) {
      const taskIdExisting = await this.cloud.getDataByKey("monitor");
      if (taskIdExisting && taskIdExisting !== taskId) {
        console.log("monitor: taskIdExisting !== taskId, exiting");
        await this.cloud.deleteTask(taskId);
        return this.stringifyJobResult({
          success: true,
        });
      }
    } else {
      const taskIdExisting = await this.cloud.getDataByKey("monitor");
      if (taskIdExisting) {
        await this.cloud.deleteTask(taskIdExisting);
      }
      let metadata = "monitor";
      try {
        const args = this.cloud.args ? JSON.parse(this.cloud.args) : undefined;
        metadata = args?.blockNumber
          ? `monitoring block ${args.blockNumber}`
          : "monitor";
      } catch (error: any) {
        console.error("Error in monitor args", error.message);
      }
      const taskId = await this.cloud.addTask({
        task: "monitor",
        startTime: Date.now(),
        userId: this.cloud.userId,
        args: JSON.stringify({
          chain: this.cloud.chain,
        }),
        maxAttempts: 10,
        metadata,
      });
      this.cloud.saveDataByKey("monitor", taskId);
      return this.stringifyJobResult({
        success: true,
      });
    }

    const needSettlement = await monitor({
      chain: this.cloud.chain as "devnet" | "zeko" | "mainnet",
    });
    if (needSettlement) {
      console.log("monitor: needSettlement, settling");
      await agentSettle();
    } else {
      console.log("monitor: no needSettlement, deleting task");
      await this.cloud.saveDataByKey("monitor", undefined);
      if (taskId) {
        await this.cloud.deleteTask(taskId);
      }
    }
    return this.stringifyJobResult({
      success: true,
    });
  }

  private async run(): Promise<boolean> {
    const statusId = "settle";
    const status = await this.cloud.getDataByKey(statusId);
    if (status === undefined) {
      await this.cloud.saveDataByKey(statusId, Date.now().toString());
      return true;
    } else if (Date.now() - Number(status) > 1000 * 60 * 15) {
      console.error(
        "Task is running for more than 15 minutes, restarting",
        this.cloud
      );
      await this.cloud.saveDataByKey(statusId, Date.now().toString());
      return true;
    } else {
      console.log("Settle is already running");
      return false;
    }
  }

  private async stop() {
    const statusId = "settle";
    await this.cloud.saveDataByKey(statusId, undefined);
  }

  private async getNonce(): Promise<number> {
    const nonce = await this.cloud.getDataByKey("nonce");
    const nonceTime = await this.cloud.getDataByKey("nonce_time");
    if (nonceTime && Date.now() - Number(nonceTime) > 1000 * 60 * 60) {
      await this.cloud.saveDataByKey("nonce", "0");
      return 0;
    }
    return nonce ? Number(nonce) : 0;
  }

  private async saveNonce(nonce: number) {
    await this.cloud.saveDataByKey("nonce", nonce.toString());
    await this.cloud.saveDataByKey("nonce_time", Date.now().toString());
  }
}
