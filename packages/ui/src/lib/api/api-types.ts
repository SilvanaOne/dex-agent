export type ApiName = "key" | "config";

export type ApiResponse<T> =
  | {
      /** Bad request - invalid input parameters */
      status: 400;
      json: { error: string };
    }
  | {
      /** Unauthorized - user not authenticated */
      status: 401;
      json: { error: string };
    }
  | {
      /** Forbidden - user doesn't have permission */
      status: 403;
      json: { error: string };
    }
  | {
      /** Too many requests */
      status: 429;
      json: { error: string };
    }
  | {
      /** Internal server error - something went wrong during deployment */
      status: 500;
      json: { error: string };
    }
  | {
      /** Service unavailable - blockchain or other external service is down */
      status: 503;
      json: { error: string };
    }
  | {
      /** Success - API response */
      status: 200;
      json: T;
    };
