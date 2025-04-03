"use server";
import { log as logtail } from "@logtail/next";
import { getChain } from "./chain";
const chain = getChain();
const log = logtail.with({
  service: "checkAddress",
  chain,
});

export async function checkAddress(
  address: string | undefined
): Promise<boolean> {
  if (!address) {
    return false;
  }
  if (typeof address !== "string") {
    log.error("checkAddress params are invalid: address is not a string", {
      address,
    });
    return false;
  }
  try {
    const addressRegex = /^B62[1-9A-HJ-NP-Za-km-z]{52}$/;
    if (!addressRegex.test(address)) {
      log.error("Invalid address format, regex test failed", { address });
      return false;
    }
    return true;
  } catch (error) {
    log.error("checkAddress catch", { address, error });
    return false;
  }
}
