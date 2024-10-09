import { TaskScheduler } from "@ovojs/task";
import { FileTask, type TaskListener } from "./file";
import { HttpClient, type Client } from "./client";

export interface Options {
  concurrency: number;
  chunkSize: number;
  listener?: TaskListener;
  client?: Client;
}

export class Kup {
  private options: Options;
  private scheduler: TaskScheduler;

  constructor(options?: Partial<Options>) {
    this.options = {...defaultOptions, ...options};
    this.scheduler = new TaskScheduler(this.options.concurrency);
  }

  public createTask(file: File, listener?: TaskListener): number {
    const task = new FileTask(
      file, 
      this.options.chunkSize,
      this.options.client ?? new HttpClient(),
      this.scheduler,
      listener ?? this.options.listener,
    );
    return this.scheduler.addTask(task);
  }

  public startTask(taskId: number): void {
    this.scheduler.startTask(taskId);
  }

  public stopTask(taskId: number): void {
    this.scheduler.removeTask(taskId);
  }

  public wait(): Promise<void> {
    return this.scheduler.wait();
  }
}

const defaultOptions: Options = {
  concurrency: 2,
  chunkSize: 1024 * 1024,  // 1MB
};