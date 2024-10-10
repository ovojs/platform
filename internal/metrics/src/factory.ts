import type { Env } from "@ovojs/runtime";
import type { Metrics } from "./types";
import { MockMetrics } from "./mock";

export function openMetrics(env: Env): Metrics {
  return new MockMetrics(env);
}
