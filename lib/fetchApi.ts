type FetchApiOpts = Omit<RequestInit, "method">;

export class FetchError extends Error {
  status: number;

  constructor(message: string = "", status: number = 400) {
    super(message);
    this.status = status;
  }

  serialize() {
    return {
      status: this.status,
      success: false,
      message: this.message,
      data: null,
    };
  }
}

export default class FetchAPI {
  constructor(
    private baseUrl?: string,
    private options?: Omit<FetchApiOpts, "body">
  ) {}

  static createInstance({
    baseUrl,
    ...opt
  }: { baseUrl?: string } & FetchApiOpts) {
    return new FetchAPI(baseUrl, opt);
  }

  private async core<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    options?: FetchApiOpts
  ) {
    const baseUrl = this.baseUrl || "";
    const fullUrl = url.startsWith("/")
      ? `${baseUrl}${url}`
      : `${baseUrl}/${url}`;

    const res = await fetch(fullUrl, {
      ...this.options,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...this.options?.headers,
        ...options?.headers,
      },
      method,
      body: ["POST", "PUT", "PATCH"].includes(method)
        ? options?.body
        : undefined,
    });

    if (!res.ok) {
      const data: { message: string; status: number } = await res.json();
      throw new FetchError(data.message, data.status);
    }
    const data: T = await res.json();
    const result = {
      headers: res.headers,
      data,
    };
    return result;
  }

  async get<T = unknown>(url: string, opt?: Omit<FetchApiOpts, "body">) {
    return await this.core<T>("GET", url, opt);
  }

  async post<T = unknown>(url: string, body: object, opt?: FetchApiOpts) {
    return await this.core<T>("POST", url, {
      ...opt,
      body: JSON.stringify(body),
    });
  }

  async put<T = unknown>(url: string, body: object, opt?: FetchApiOpts) {
    return await this.core<T>("PUT", url, {
      ...opt,
      body: JSON.stringify(body),
    });
  }

  async patch<T = unknown>(url: string, body: object, opt?: FetchApiOpts) {
    return await this.core<T>("PATCH", url, {
      ...opt,
      body: JSON.stringify(body),
    });
  }

  async delete<T = unknown>(url: string, opt?: Omit<FetchApiOpts, "body">) {
    return await this.core<T>("DELETE", url, opt);
  }
}
