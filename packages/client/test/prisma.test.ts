import { describe, it } from "node:test";
import assert from "node:assert";
import {
  addFetchedSequence,
  isSequenceFetched,
  getFetchedSequences,
  sqlReadOnlyQuery,
  sqlListTables,
  sqlGetTableStructure,
} from "@dex-agent/lib";

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
});
