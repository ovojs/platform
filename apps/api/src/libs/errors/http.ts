import type { HonoEnv } from "$libs/hono/env";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const zAPIError = z.object({
  code: z.number().int().openapi({
    description: "A machine readable error code",
    example: 100000,
  }),
  message: z.string().openapi({
    description: "A human readable message of what went wrong.",
    example: "Bad user name."
  }),
  reference: z.string().openapi({
    description: "A link to the documentation about this error code.",
    example: "https://ovojs.dev/docs/errors/100000",
  }),
  requestId: z.string().openapi({
    description: "An error MUST always include a request ID.",
    example: "719ea455-2313-4787-9658-ac34f978c00f"
  }),
});

export type APIError = z.infer<typeof zAPIError>;

export class APIException extends HTTPException {
  constructor (
    readonly code: number, 
    readonly message: string,
    readonly reference?: string,
  ) {
    const status = ((code >= 100 && code <= 511) ? code : 500) as StatusCode;
    super(status, { message });
  }
}

export function handleError(e: Error, c: Context<HonoEnv>): Response {
  if (e instanceof APIException) {
    return c.json<APIError>({
      code: e.code,
      message: e.message,
      reference: `https://ovojs.dev/docs/errors/${e.code}`,
      requestId: c.get("requestId"),
    });
  }

  if (e instanceof HTTPException) {
    return c.json<APIError>({
      code: e.status,
      message: e.message,
      reference: `https://ovojs.dev/docs/errors/${e.status}`,
      requestId: c.get("requestId"),
    }, e.status);
  }

  return c.json<APIError>({
    code: 500,
    message: e.message ?? "Something unexpected happened.",
    reference: `https://ovojs.dev/docs/errors/500`,
    requestId: c.get("requestId"),
  }, 500);
}
