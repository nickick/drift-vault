import { ZodError } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*",
};
export function handleError(err: unknown, status = 500, headers: object = {}) {
  if (err instanceof ZodError) {
    return {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
        ...headers,
      },
      body: JSON.stringify({
        success: false,
        message: err.issues,
      }),
    };
  }
  const message = (err as Error).message;
  console.error(message);
  console.error(err);
  return {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...headers,
    },
    body: JSON.stringify({ success: false, message }),
  };
}
