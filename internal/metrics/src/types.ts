import { z } from "zod";

const zMetric = z.object({

});

export type Metric = z.infer<typeof zMetric>;

export interface Metrics {
  emit(metric: Metric): void;
  flush(): Promise<void>;
}
