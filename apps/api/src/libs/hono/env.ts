import { z } from "zod";

const zEnv = z.object({});

export type Env = z.infer<typeof zEnv>;

export interface HonoEnv {
  Bindings: Env,
  Variables: {
    isolateId: string;
    requestId: string;
  }
}
