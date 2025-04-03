"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDAUrl } from "@dex-agent/lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { url } = req.query;
  if (!url || typeof url !== "string" || url.length === 0) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    console.log("Fetching DA blobId:", url);
    const daUrl = await getDAUrl({ blobId: url });
    const response = await fetch(daUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      console.error("Fetch failed:", {
        status: response.status,
        statusText: response.statusText,
      });
      return res.status(response.status).json({
        error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
      });
    }

    // Get the content type from the response
    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    // Set response headers
    res.setHeader("Content-Disposition", "inline");

    try {
      // If it's JSON, parse and stringify it
      const json = JSON.parse(text);
      res.setHeader("Content-Type", "application/json");
      console.log("Opening JSON:");
      return res.status(200).send(text);
    } catch (error) {
      // If it's not JSON, return as plain text
      res.setHeader("Content-Type", "text/plain");
      console.log("Opening TEXT:");
      return res.status(200).send(text);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({
      error: "Failed to process request",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
