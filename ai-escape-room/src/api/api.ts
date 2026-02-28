export class HttpError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message ?? `HTTP ${status}`);
    this.status = status;
    this.name = "HttpError";
  }
}

type FetchJsonOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function fetchJson(
  url: string,
  options: FetchJsonOptions,
  token?: string
): Promise<Response> {
  return await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : (undefined as any),
  } as RequestInit);
}

export const post = async (
  url: string,
  body: object,
  token?: string
): Promise<Response> => fetchJson(url, { method: "POST", body }, token);

export const get = async (
  url: string,
  token?: string
): Promise<Response> => fetchJson(url, { method: "GET" }, token);

