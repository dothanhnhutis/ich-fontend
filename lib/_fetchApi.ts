type FetchApiOpts = Omit<RequestInit, "method">;
type JSONObject = Record<string, unknown>;

export class FetchError extends Error {
  status: number;
  data: unknown;

  constructor(err: { message: string; status: number; data: unknown }) {
    super(err.message ?? "");
    this.status = err.status || 400;
    this.data = err.data;
  }

  serialize() {
    return {
      status: this.status,
      success: false,
      message: this.message,
      data: this.data,
    };
  }
}

export default class FetchAPI {
  constructor(
    private baseUrl?: string,
    private options?: Omit<FetchApiOpts, "body">
  ) {}

  static create({ baseUrl, ...opt }: { baseUrl?: string } & FetchApiOpts) {
    return new FetchAPI(baseUrl, opt);
  }

  private async core<T = unknown>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    options?: FetchApiOpts
  ) {
    const baseUrl = this.baseUrl || "";
    const fullUrl = url.startsWith("/")
      ? `${baseUrl}${url}`
      : `${baseUrl}/${url}`;
    const isFormData = options?.body instanceof FormData;

    const { ok, json, headers } = await fetch(fullUrl, {
      ...this.options,
      ...options,
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...this.options?.headers,
        ...options?.headers,
      },
      method,
    });

    if (!ok) {
      const resJson: { message: string; status: number; data: unknown } =
        await json();

      throw new FetchError({
        data: resJson.data,
        status: resJson.status,
        message: resJson.message,
      });
    }
    const data: { message: string; status: number; success: boolean; data: T } =
      await json();
    const result = {
      headers: headers,
      data,
    };
    return result;
  }

  async get<T>(url: string, opt?: Omit<FetchApiOpts, "body">) {
    return await this.core<T>("GET", url, opt);
  }

  async post<T = unknown, E = unknown>(
    url: string,
    body: JSONObject | FormData,
    opt?: FetchApiOpts
  ) {
    const isFormData = body instanceof FormData;
    return await this.core<T>("POST", url, {
      ...opt,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  async put<T = unknown, E = unknown>(
    url: string,
    body: JSONObject | FormData,
    opt?: FetchApiOpts
  ) {
    const isFormData = body instanceof FormData;
    return await this.core<T>("PUT", url, {
      ...opt,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  async patch<T = unknown, E = unknown>(
    url: string,
    body: JSONObject | FormData,
    opt?: FetchApiOpts
  ) {
    const isFormData = body instanceof FormData;
    return await this.core<T>("PATCH", url, {
      ...opt,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  async delete<T = unknown, E = unknown>(
    url: string,
    opt?: Omit<FetchApiOpts, "body">
  ) {
    return await this.core<T>("DELETE", url, opt);
  }

  async deleteBody<T = unknown, E = unknown>(
    url: string,
    body: JSONObject | FormData,
    opt?: FetchApiOpts
  ) {
    const isFormData = body instanceof FormData;
    return await this.core<T>("DELETE", url, {
      ...opt,
      body: isFormData ? body : JSON.stringify(body),
    });
  }
}
