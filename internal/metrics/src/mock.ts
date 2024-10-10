import type { Env } from "@ovojs/runtime";
import type { Metric, Metrics } from "./types";

export class MockMetrics implements Metrics {
  constructor (env: Env) {}
  emit(metric: Metric): void {}
  flush(): Promise<void> {
    return Promise.resolve();
  }
}