"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import { withLogtail, BetterStackRequest } from "@logtail/next";
import {
  rateLimit,
  initializeMemoryRateLimiter,
  initializeRedisRateLimiter,
} from "./rate-limit";
import { ApiResponse, ApiName } from "./api-types";
import { debug } from "../debug";
import { getChain } from "@/lib/chain";
const chain = getChain();
const DEBUG = debug();

initializeMemoryRateLimiter({
  name: "ipMemory",
  points: 120,
  duration: 60,
});

// initializeMemoryRateLimiter({
//   name: "apiMemory",
//   points: 120,
//   duration: 60,
// });

export function apiHandler<T, V>(params: {
  name: ApiName;
  handler: (props: { params: T; name: ApiName }) => Promise<ApiResponse<V>>;
}) {
  //eturn withLogtail(apiHandlerInternal(params));
  return apiHandlerInternal(params);
}

function apiHandlerInternal<T, V>(params: {
  name: ApiName;
  handler: (props: { params: T; name: ApiName }) => Promise<ApiResponse<V>>;
}) {
  const { name, handler } = params;

  return async (req: NextApiRequest & { body: T }, res: NextApiResponse) => {
    //req.log.info("apiHandler", { name });
    const start = Date.now();
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.status(200).end();
      return;
    }

    if (req.method !== "GET" && req.method !== "POST") {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
    }

    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",").shift() ||
      req.socket?.remoteAddress ||
      "0.0.0.0";
    console.log("api ip", ip);

    if (await rateLimit({ name: "ipMemory", key: ip })) {
      return await reply(429, { error: "Too many requests" });
    }

    async function reply(status: number, json: { error: string } | V) {
      if (status !== 200) console.error("api reply", { status, json });
      console.error("api reply", { status, json });
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");

      const end = Date.now();
      if (DEBUG) console.log("API response sent in", end - start, "ms");
      // Set response status and send JSON
      res.status(status).json(json);
    }

    try {
      const checked = Date.now();
      if (DEBUG) console.log("Rate limiting checked in", checked - start, "ms");
      const { status, json } = await handler({
        params: req.body,
        name,
      });
      const handled = Date.now();
      if (DEBUG) console.log("Handler executed in", handled - checked, "ms");
      return await reply(status, json);
    } catch (error) {
      //req.log.error("apiHandler error", { error });
      console.error("apiHandler error", error);
      return await reply(500, { error: "Invalid request body" });
    }
  };
}
