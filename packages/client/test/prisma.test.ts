import { describe, it } from "node:test";
import assert from "node:assert";
import {
  addFetchedSequence,
  isSequenceFetched,
  getFetchedSequences,
  sqlReadOnlyQuery,
  sqlListTables,
  sqlGetTableStructure,
  addSequenceData,
} from "@dex-agent/lib";
import { fetchSequenceData } from "@dex-agent/contracts";

describe("Prisma", async () => {
  it("should save to Prisma", async () => {
    await addFetchedSequence(1n);
    assert.ok(isSequenceFetched(2n), "sequence is not fetched");
  });

  it("should read from Prisma", async () => {
    const sequences = await getFetchedSequences();
    console.log("sequences", sequences);
    assert.ok(sequences.length > 0, "sequences are not fetched");
    const isFetched = await isSequenceFetched(1n);
    console.log("isFetched", isFetched);
    assert.ok(isFetched, "sequence is not fetched");
  });

  it("should read tables list from Prisma", async () => {
    const tables = await sqlListTables();
    console.log("tables", tables);
  });

  it("should read table structure from Prisma", async () => {
    const structure = await sqlGetTableStructure("State");
    console.log("structure", structure);
  });

  it("should run raw query", async () => {
    const data = await sqlReadOnlyQuery('SELECT * FROM "FetchedSequences"');
    console.log("data", data);
  });

  it("should run raw query", async () => {
    const sequence = 62n;
    const blockNumber = 39;
    const isFetched = await isSequenceFetched(sequence);
    if (!isFetched) {
      console.log(
        `sqlRequest: sequence is not fetched, fetching sequence ${sequence} for block ${blockNumber}`
      );
      const sequenceData = await fetchSequenceData({
        sequence: Number(sequence),
        blockNumber,
        prove: false,
        cache: undefined as any,
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
  });
});
