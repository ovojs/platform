import { OpenAPIHono } from "@hono/zod-openapi";
import { handleError } from "$libs/errors/http";
import type { HonoEnv } from "./env";
import type { Context } from "hono";

export function createApp() {
  const app = new OpenAPIHono<HonoEnv>();
  app.onError(handleError);

  app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
      title: "OvO API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://api.ovojs.dev",
        description: "Production",
      }
    ]
  });

  app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
    bearerFormat: "root key",
    type: "http",
    scheme: "bearer",
  });
  return app;
}

export type App = ReturnType<typeof createApp>;
export type Ctx = Context<HonoEnv>;
