"use server";
import { apiHandler } from "@/lib/api/api";
import { ApiName, ApiResponse } from "@/lib/api/api-types";
import { startCheck } from "@/lib/check";
// pages/api/background-task.ts

// The configuration tells Vercel to run this function as a Node.js runtime
// and enables background processing with a maximum duration.
export const config = {
  runtime: "nodejs", // Must be 'nodejs' for background functions.
  background: {
    maxDuration: 10, // Maximum background runtime in seconds.
  },
};

interface BackgroundInput {
  key: string;
}

interface BackgroundOutput {
  key: string;
}

export default apiHandler<BackgroundInput, BackgroundOutput>({
  name: "key",
  handler: performBackgroundTask,
});

// // The API route handler
// export default async function handler(req, res) {
//   // Immediately send a response to the client
//   res
//     .status(200)
//     .json({ message: "Request received, processing in background." });

//   // After sending the response, perform background tasks.
//   // For example, you might call another async function:
//   await performBackgroundTask();
// }

export async function performBackgroundTask(props: {
  params: BackgroundInput;
  name: ApiName;
}): Promise<ApiResponse<BackgroundOutput>> {
  // Your background logic here, e.g. sending emails, processing data, etc.
  console.log("Performing background task...");
  const done = await startCheck(props.params.key);
  return {
    status: 200,
    json: {
      key: props.params.key + ": " + done,
    },
  };
}
