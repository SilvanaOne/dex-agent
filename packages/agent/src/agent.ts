import { zkCloudWorker, Cloud, sleep } from "@silvana-one/prover";
import { JobResult } from "@silvana-one/api";
import { VerificationKey, Cache } from "o1js";
import { prove, merge, settle, monitor } from "@dex-agent/contracts";
import { agentSettle } from "@dex-agent/lib";

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
      task !== "monitor"
    )
      throw new Error("Invalid task");
    try {
      switch (task) {
        case "prove":
          return await this.proveDex();
        case "merge":
          return await this.mergeDex();
        case "settle":
          return await this.settleDex();
        case "monitor":
          return await this.monitorDex(undefined);
      }
    } catch (error: any) {
      console.error(`Error in ${task}`, error.message);
      return this.stringifyJobResult({
        success: false,
        error: String(error.message),
      });
    }
  }
  private stringifyJobResult(result: JobResult): string {
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
    return JSON.stringify(strippedResult, null, 2);
  }

  private async proveDex(): Promise<string> {
    console.time("proveDex");
    const result = await prove({
      jobId: this.cloud.jobId,
      endTime: Date.now() + MAX_RUN_TIME,
      cache: this.cache,
    });
    console.log("proveDex result", result);
    await this.cloud.publishTransactionMetadata({
      txId: "dex:prove:" + this.cloud.jobId,
      metadata: {
        custom: {
          task: "calculate proof",
          submitted: result.proofs_submitted.length,
          rejected: result.proofs_rejected.length,
          ...result,
        },
      },
    });
    console.timeEnd("proveDex");
    return this.stringifyJobResult({
      success: true,
    });
  }

  private async mergeDex(): Promise<string> {
    console.time("mergeDex");
    const result = await merge({
      jobId: this.cloud.jobId,
      endTime: Date.now() + MAX_RUN_TIME,
      cache: this.cache,
    });
    console.log("mergeDex result", result);
    await this.cloud.publishTransactionMetadata({
      txId: "dex:merge:" + this.cloud.jobId,
      metadata: {
        custom: {
          task: "merge proofs",
          submitted: result.proofs_submitted.length,
          verified: result.proofs_verified.length,
          rejected: result.proofs_rejected.length,
          ...result,
        },
      },
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
          txId: "dex:settle:" + this.cloud.jobId,
          metadata: {
            custom: {
              task: "settle",
              settlements_txs_number: result.settlements.length,
              data_availability_txs_number: result.data_availability.length,
              ...result,
            },
          },
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
