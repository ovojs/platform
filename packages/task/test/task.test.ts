import { describe, expect, test } from "vitest";
import { BaseTask, TaskScheduler } from "../src/task";

let taskStarted = 0;
let taskStopped = 0;

class TestTask extends BaseTask {
  async start() {
    taskStarted++;
  }
  async stop() {
    taskStopped++;
  }
}

describe("test scheduler", () => {
  
  test("add and remove 100 task", () => {
    const N = 100;
    const taskIds = new Array<number>(N);
    const scheduler = new TaskScheduler(2);

    for (let i = 0; i < N; i++) {
      taskIds[i] = scheduler.addTask(new TestTask());
      expect(taskIds[i]).eq(i + 1);
    }
    expect(scheduler.size).eq(taskIds.length);
    taskIds.forEach((taskId) => {
      scheduler.removeTask(taskId);
    });
    expect(scheduler.size).eq(0);
  });

  test("add and start 100 task with 2 concurrency", async () => {
    const N = 100;
    const C = 2;
    const taskIds = new Array<number>(100);
    const scheduler = new TaskScheduler(2);

    for (let i = 0; i < N; i++) {
      taskIds[i] = scheduler.addTask(new TestTask());
      expect(taskIds[i]).eq(i + 1);
    }
    taskIds.forEach((taskId) => {
      scheduler.startTask(taskId);
    });
    expect(scheduler.running).eq(C);

    await scheduler.wait(); // wait until all tasks are done.
    expect(scheduler.size).eq(0);
    expect(taskStarted).eq(N);
    expect(taskStopped).eq(N);
  });
});
