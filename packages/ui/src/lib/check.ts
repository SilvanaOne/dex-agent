"use server";
import { after } from "next/server";
import { log as logtail } from "@logtail/next";
import { getChain } from "./chain";
import { sleep } from "./sleep";
const chain = getChain();
const log = logtail.with({
  service: "check",
  chain,
});

export async function startCheck(key: string) {
  log.info("checking...", { key });
  after(async () => {
    await check(key);
  });
  return "started";
}

async function check(key: string) {
  const start = Date.now();
  log.info("started check", { key });
  await sleep(5000);
  const end = Date.now();
  log.info("check done", { key, duration: end - start });
}
