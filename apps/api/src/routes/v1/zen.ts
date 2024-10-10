import type { App } from "$libs/hono/app";
import { createRoute, z } from "@hono/zod-openapi";

const route = createRoute({
  operationId: "zen",
  method: "get",
  path: "/v1/zen",
  responses: {
    200: {
      description: "The Zen of OvO",
      content: {
        "text/plain": {
          schema: z.string(),
        }
      }
    }
  }
});

export type Route = typeof route;

export function registerV1Zen(app: App) {
  app.openapi(route, async (c) => {
    return c.text(`
  OvO - build something fun

  requestId: ${c.get("requestId")}
   `);
  });
}
