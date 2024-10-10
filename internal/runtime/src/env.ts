import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    DATABASE_TOKEN: z.string(),
    DATABASE_URL_READONLY: z.string(),
    DADABASE_TOKEN_READONLY: z.string(),
  },
  runtimeEnv: process.env,
});

export type Env = typeof env;
