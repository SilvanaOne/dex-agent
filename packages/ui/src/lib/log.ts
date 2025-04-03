"use client";
import { getSystemInfo } from "./system-info";
import { log as logtail } from "@logtail/next";
import { getChainId } from "./chain";
import { geo, unavailableCountry, isFetchedFailed } from "./availability";
import { nanoid } from "nanoid";

const id = nanoid();
const chainId = getChainId();
//TODO: remove system from the log when the version will be stable
const system = getSystemInfo();
export const log = logtail.with({
  id,
  chainId,
  system,
  service: "web",
  siteType: "dex-agent",
});

async function logSystemInfo() {
  const start = Date.now();
  let corsStatus = "unknown";
  try {
    const response = await fetch(window.location.origin, { method: "HEAD" });
    corsStatus = response.ok ? "enabled" : "disabled";
  } catch (error) {
    corsStatus = "disabled";
  }

  while (!(geo || isFetchedFailed) && Date.now() - start < 10000) {
    await sleep(1000);
  }
  log.info("new browser session", {
    corsStatus,
    geo,
    unavailableCountry,
    isFetchedFailed,
    infoDelay: Date.now() - start,
  });
}
logSystemInfo();

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
