import type { HonoEnv } from "$libs/hono/env";
import { openDB } from "@ovojs/db";
import { openMetrics } from "@ovojs/metrics";
import type { MiddlewareHandler } from "hono";


let isolateId: string;
let isolatedCreatedAt: number;

export function init(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    if (!isolateId) {
      isolateId = crypto.randomUUID();
      isolatedCreatedAt = Date.now();
    }
    c.set("isolateId", isolateId);
    c.set("isolateCreatedAt", isolatedCreatedAt);

    const requestId = crypto.randomUUID();
    c.set("requestId", requestId);
    c.set("requestCreatedAt", Date.now());

    const primary = openDB(c.env);
    const readonly = openDB(c.env, true);
    const metrics = openMetrics(c.env);

    c.set("service", {
      db: { primary, readonly },
      metrics,
    });
    
    await next();
  }
}