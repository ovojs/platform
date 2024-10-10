import { type Database } from "@ovojs/db";
import { type Metrics } from "@ovojs/metrics";
import type { Env } from "@ovojs/runtime";

export type Service = {
  db: {
    primary: Database,
    readonly: Database,
  },
  metrics: Metrics,
};

export interface HonoEnv {
  Bindings: Env,
  Variables: {
    isolateId: string;
    isolateCreatedAt: number;
    requestId: string;
    requestCreatedAt: number;
    service: Service;
  }
}
