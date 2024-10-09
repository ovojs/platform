import { BaseTask, TaskScheduler, WaitGroup } from "@ovojs/task";
import type { FileInfo, PartInfo, Client } from "./client";


export interface TaskListener {
  onStart(taskId: number): void;
  onProgress(taskId: number, info: ProgressInfo): void;
  onStop(taskId: number): void;
  onError(taskId: number, error: Error): void;
}

export interface ProgressInfo {
  file: File;
  partSeq: number;
  loaded: number;
  speed: number;
}

export class FileTask extends BaseTask {
  private partInfoList: Array<PartInfo>;
  public fileInfo?: FileInfo;
  public lastProgressMs = 0;
  public loaded = 0;

  constructor(
    public file: File,
    public chunkSize: number,
    public client: Client,
    public scheduler: TaskScheduler,
    public listener?: TaskListener
  ) {
    super();
    this.partInfoList = new Array<PartInfo>(Math.ceil(file.size / this.chunkSize));
    this.initPartInfoList();
  }

  private initPartInfoList() {
    for (let i = 0; i < this.partInfoList.length; i++) {
      this.partInfoList[i] = { seq: i, sha: "" };
    }
  }

  public async start() {
    await this.prepare();
    await this.progress();
    await this.finish();
  }

  public async stop() {
    this.partInfoList.forEach((partInfo) => {
      if (partInfo.taskId && partInfo.taskId > 0) {
        this.scheduler.removeTask(partInfo.taskId);
      }
    });
  }

  public async prepare() {
    this.listener?.onStart(this.id);
    const fileInfo = await this.client.prepare();
    if (!fileInfo) {
      this.listener?.onError(this.id, new Error("Prepare request "));
      return;
    }
    this.fileInfo = fileInfo;
  }

  public async progress() {
    this.lastProgressMs = new Date().getTime();
    return new WaitGroup(this.partInfoList.length, (done) => {
      this.partInfoList.forEach((partInfo) => {
        if (partInfo.finished) return;
        if (!this.fileInfo) return;
        const start = partInfo.seq * this.chunkSize;
        const end = Math.min(this.file.size, (partInfo.seq + 1) * this.chunkSize);
        const chunk = this.file.slice(start, end);
        const task = new PartTask(this, chunk, partInfo, done);
        partInfo.taskId = task.id;
        this.scheduler.addAndStartTask(task);
      });
    }).wait();
  }

  public async finish() {
    if (!this.fileInfo) {
      this.listener?.onError(this.id, new Error("Bad FileTask"));
      return;
    }
    this.client.finish(this.fileInfo)
      .then(() => this.listener?.onStop(this.id))
      .catch((err) => this.listener?.onError(this.id, err))
  }
}

class PartTask extends BaseTask {
  private abortController: AbortController;
  private client: Client;
  private listener?: TaskListener;

  constructor(
    private fileTask: FileTask,
    private chunk: Blob,
    private partInfo: PartInfo,
    private done?: (err?: Error) => void
  ) {
    super();
    this.client = fileTask.client;
    this.listener = fileTask.listener;
    this.abortController = new AbortController();
  }

  public async start() {
    if (!this.fileTask.fileInfo) {
      this.listener?.onError(this.fileTask.id, new Error("Bad FileTask"));
      return;
    }
    this.client.uploadPart(this.fileTask.fileInfo, this.partInfo.seq, this.chunk, this.abortController)
      .then((partInfo) => {
        const now = new Date().getTime();
        const speed = 1000_000 * this.chunk.size / (now - (this.fileTask.lastProgressMs));
        this.partInfo.finished = true;
        this.fileTask.loaded += this.chunk.size;
        this.fileTask.lastProgressMs = now;
        this.listener?.onProgress(this.fileTask.id, { file: this.fileTask.file, partSeq: partInfo.seq, loaded: this.fileTask.loaded, speed });
        this.done?.();
      })
      .catch((err) => {
        this.listener?.onError(this.fileTask.id, err);
        this.done?.(err);
      })
  }

  public async stop() {
    this.abortController.abort();
  }
}