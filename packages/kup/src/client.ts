export interface Client {
  prepare(bizId?: number): Promise<FileInfo>;
  listParts(fileInfo: FileInfo): Promise<Array<PartInfo>>;
  uploadPart(fileInfo: FileInfo, partSeq: number, chunk: Blob, abortController: AbortController): Promise<PartInfo>;
  finish(fileInfo: FileInfo): Promise<FileInfo>;
}

export interface PartInfo {
  seq: number;
  sha: string;
  finished?: boolean;
  taskId?: number;
}

export interface FileInfo {
  fileId: string;
  uploadId: string;
  bizId?: number;
}

export interface HttpClientOptions {
  baseUrl: string;
  bizId: number;
  fetch: typeof fetch;
}

export class HttpClient implements Client {
  private options: HttpClientOptions;
  private headers: HeadersInit;

  constructor(options?: Partial<HttpClientOptions>) {
    this.options = { 
      ...options, 
      fetch,
      baseUrl: "",
      bizId: -1,
    };
    this.headers = {
      "x-biz-id": options?.bizId?.toString() ?? "",
    };
  }

  async prepare(bizId?: number): Promise<FileInfo> {
    const res = await this.options.fetch(`${this.options.baseUrl}/prepare`, {
      method: "POST",
      headers: {
        ...this.headers,
        "content-type": "application/json"
      },
      body: JSON.stringify({ bizId }),
    });
    if (!res.ok) throw new Error(`Prepare request got response state code ${res.status}`);
    return res.json();
  }

  async listParts(fileInfo: FileInfo): Promise<Array<PartInfo>> {
    const params = new URLSearchParams(Object.fromEntries(Object.entries(fileInfo)));
    const res = await this.options.fetch(`${this.options.baseUrl}/listparts?${params}`, {
      method: "GET",
      headers: {
        ...this.headers,
        "content-type": "application/json"
      },
    });
    if (!res.ok) throw new Error(`ListParts request got response state code ${res.status}`);
    return res.json();
  }

  async uploadPart(fileInfo: FileInfo, partSeq: number, chunk: Blob, abortController: AbortController): Promise<PartInfo> {
    const params = new URLSearchParams(Object.fromEntries(Object.entries(Object.assign({ partSeq }, fileInfo))));
    const res = await this.options.fetch(`${this.options.baseUrl}/uploadpart?${params}`, {
      signal: abortController.signal,
      method: "POST",
      headers: {
        ...this.headers,
        "content-type": "application/octet-stream",
        "content-length": chunk.size.toString(),
      },
      body: chunk,
    });
    if (!res.ok) throw new Error(`UploadPart request got response state code ${res.status}`);
    return res.json();
  }

  async finish(fileInfo: FileInfo): Promise<FileInfo> {
    const res = await this.options.fetch(`${this.options.baseUrl}/finish`, {
      method: "POST",
      headers: {
        ...this.headers,
        "content-type": "application/json"
      },
      body: JSON.stringify(fileInfo),
    });
    if (!res.ok) throw new Error(`Finish request got response state code ${res.status}`);
    return res.json();
  }
}
