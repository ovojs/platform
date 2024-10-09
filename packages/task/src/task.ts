enum TaskState {
  Idle,
  Runnable,
  Running,
  Dead,
}

export interface Task {
  id: number;
  state: TaskState;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export abstract class BaseTask implements Task {
  public id = -1;
  public state = TaskState.Idle;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
}

export class TaskScheduler {
  private taskMap = new Map<number, Task>();
  private taskQueue = new Array<Task>();
  private taskNext?: Task;
  private taskRunning = 0;
  private taskSeq = 1;

  private stopped?: Promise<void>;
  private stop?: () => void;

  constructor(private concurrency: number) {}

  public addTask(task: Task): number {
    const taskId = this.taskSeq++;
    task.id = taskId;
    task.state = TaskState.Idle;
    this.taskMap.set(taskId, task);
    return taskId;
  }

  public removeTask(taskId: number) {
    const task = this.taskMap.get(taskId);
    if (!task) return;
    if (task.state == TaskState.Runnable) task.state = TaskState.Dead;  // Let the scheduler delete it
    if (task.state == TaskState.Running) task.stop();
    this.taskMap.delete(taskId);
    if (this.taskMap.size == 0) {
      this.stop?.();
    }
  }

  public startTask(taskId: number, next?: boolean): void {
    const task = this.taskMap.get(taskId);
    if (!task) throw new Error(`task ${taskId} does not exist`);
    task.state = TaskState.Runnable;
    if (next) this.taskNext = task;
    else this.taskQueue.push(task);
    this.trySchedule();
  }

  private trySchedule(): void {
    if (!this.stopped) {
      this.stopped = new Promise((resolve) => {
        this.stop = resolve;
      });
    }
    if (this.taskRunning < this.concurrency) {
      this.schedule();
    }
  }

  private schedule(): void {
    let task = this.taskNext;
    if (task) {
      this.taskNext = undefined;
      this.execute(task);
      return;
    }
    task = this.taskQueue.pop();
    if (task) {
      this.execute(task);
      return;
    }
  }

  private execute(task: Task) {
    if (task.state !== TaskState.Runnable) {
      this.trySchedule();
      return;
    }
    task.state = TaskState.Running;
    task.start().then(async () => {
      await task.stop();
      task.state = TaskState.Dead;
      this.taskRunning--;
      this.removeTask(task.id);
      this.trySchedule();
    })
    this.taskRunning++;
    this.trySchedule();
  }

  public wait(): Promise<void> {
    return this.stopped ?? Promise.resolve();
  }

  public addAndStartTask(task: Task, next?: boolean): void {
    this.startTask(this.addTask(task), next);
  }

  public get size(): number {
    return this.taskMap.size;
  }

  public get running(): number {
    return this.taskRunning;
  }
}

export class WaitGroup {
  private task: Promise<void>;

  constructor (n: number, f: (done: (err?: Error) => void) => void) {
    this.task = new Promise((resolve, reject) => {
      const done = (err?: Error): void => {
        if (err) {
          reject(err);
          return;
        }
        n--;
        if (n <= 0) {
          resolve();
        }
      };
      f(done);
    });
  }

  public wait(): Promise<void> {
    return this.task;
  }
}
