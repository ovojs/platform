import { describe, test, expect } from "vitest";
import { ProgressInfo, TaskListener } from "../src/file";
import { Client, FileInfo, PartInfo } from "../src/client";
import { Kup } from "../src/kup";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class MockTaskListener implements TaskListener {
  onStart(taskId: number): void {
    console.log(`[${taskId}] start`);
  }
  onStop(taskId: number): void {
    console.log(`[${taskId}] stop`);
  }
  onError(taskId: number, error: Error): void {
    console.log(`[${taskId}] error: ${error}`);
  }
  onProgress(taskId: number, info: ProgressInfo): void {
    const speed = (info.speed / 1024).toFixed(0);
    const loaded = (100 * info.loaded / info.file.size).toFixed(0);
    console.log(`[${taskId}] progress: part=${info.partSeq}, speed=${speed}KiB/s, uploaded=${loaded}%, file=${info.file.name}`);
  }
}

class MockClient implements Client {
  prepared = 0;
  finished = 0;
  partNum = 0;

  async prepare(bizId?: number): Promise<FileInfo> {
    this.prepared++;
    return { fileId: "file-1", uploadId: "upload-1" };
  }
  async finish(fileInfo: FileInfo): Promise<FileInfo> {
    this.finished++;
    return { fileId: "file-1", uploadId: "upload-1" };
  }
  async uploadPart(fileInfo: FileInfo, partSeq: number, chunk: Blob, abortController: AbortController): Promise<PartInfo> {
    this.partNum++;
    return { seq: partSeq, sha: "sha-xxx" };
  }
  async listParts(fileInfo: FileInfo): Promise<Array<PartInfo>> {
    return [];
  }
}

describe("test kup", () => {

  test("create and start a task", async () => {
    const concurrency = 2;
    const chunkSize = 5;
    const client = new MockClient();
    const listener = new MockTaskListener();
    const kup = new Kup({ concurrency, chunkSize, listener, client });
    const text = "This text has 23 bytes.";
    const file = new File([text], "test.txt");
    const taskId = kup.createTask(file);
    expect(taskId).eq(1);
    kup.startTask(taskId);
    await kup.wait();  // Wait until all task are done.
    expect(client.prepared).eq(1);
    expect(client.finished).eq(1);
    expect(client.partNum).eq(Math.ceil(text.length / chunkSize));
  });

});
