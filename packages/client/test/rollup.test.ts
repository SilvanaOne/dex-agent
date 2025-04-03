import { describe, it } from "node:test";
import assert from "node:assert";
import {
  UInt32,
  Bool,
  UInt64,
  PrivateKey,
  PublicKey,
  Field,
  Struct,
  ZkProgram,
  Gadgets,
  Provable,
  Cache,
} from "o1js";
import { DEXProgram } from "@dex-agent/contracts";

describe("Rollup", async () => {
  it("should analyze contracts methods", async () => {
    console.log("Analyzing contracts methods...");
    console.time("methods analyzed");
    const methods = [
      {
        name: "DEXProgram",
        result: await DEXProgram.analyzeMethods(),
        skip: false,
      },
      // {
      //   name: "DEX Contract",
      //   result: await (DEXContract as any).analyzeMethods(),
      //   skip: false,
      // },
    ];
    console.timeEnd("methods analyzed");
    const maxRows = 2 ** 16;
    for (const contract of methods) {
      // calculate the size of the contract - the sum or rows for each method
      const size = Object.values(contract.result).reduce(
        (acc, method) => acc + (method as any).rows,
        0
      );
      // calculate percentage rounded to 0 decimal places
      const percentage =
        Math.round((((size as number) * 100) / maxRows) * 100) / 100;

      console.log(
        `${contract.name} rows: ${size} (${percentage}% of max ${maxRows} rows)`
      );
      if (contract.skip !== true)
        for (const method in contract.result) {
          console.log(
            "\t",
            method,
            `rows:`,
            (contract.result as any)[method].rows
          );
        }
    }
  });

  it("should compile DEX Contract", async () => {
    console.log("compiling...");
    console.time("compiled DEXProgram");
    const cache = Cache.FileSystem("./cache");
    const { verificationKey } = await DEXProgram.compile({ cache });
    console.timeEnd("compiled DEXProgram");
  });
});
