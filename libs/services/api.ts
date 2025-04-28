export class APIError<T = any> extends Error {
  isAPIError: boolean;
  response: APIResponse<T>;
  config: APIRequestConfig;

  constructor(message: string, response: APIResponse<T>) {
    super(message);
    this.name = "FechApiError";
    this.isAPIError = true;
    this.response = response;
    this.config = response.config;
  }
}

interface APIRequestConfig extends RequestInit {
  url?: string;
  baseUrl?: string;
  params?: Record<string, any>;
  data?: any;
}

interface APIResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: APIRequestConfig;
  request: Response;
}

type RequestInterceptor = (
  config: APIRequestConfig
) => APIRequestConfig | Promise<APIRequestConfig>;

type ResponseInterceptor<T = any> = (
  response: APIResponse<T>
) => APIResponse<T> | Promise<APIResponse<T>>;

export class API {
  defaults: APIRequestConfig;
  interceptors: {
    request: RequestInterceptor[];
    response: ResponseInterceptor[];
  };

  constructor(defaults: APIRequestConfig = {}) {
    this.defaults = defaults;
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  static create(defaults: APIRequestConfig = {}): API {
    return new API(defaults);
  }

  private async request<T = any>(
    config: APIRequestConfig
  ): Promise<APIResponse<T>> {
    // Gộp cấu hình mặc định và cấu hình truyền vào
    config = { ...this.defaults, ...config };

    // Áp dụng các interceptor cho request
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config);
    }

    // Xây dựng URL đầy đủ (kết hợp baseUrl, url và params nếu có)
    let url = config.url || "";

    if (config.baseUrl && !url.startsWith("http")) {
      url = config.baseUrl + url;
    }
    if (config.params) {
      const queryString = new URLSearchParams(config.params).toString();
      url += (url.includes("?") ? "&" : "?") + queryString;
    }

    // Chuẩn bị cấu hình cho fetch
    const fetchConfig: RequestInit = { ...config };

    // Nếu có data và method không phải GET thì gán data vào body
    if (config.data && config.method?.toUpperCase() !== "GET") {
      if (!(config.data instanceof FormData)) {
        fetchConfig.body = JSON.stringify(config.data);
        fetchConfig.headers = {
          "Content-Type": "application/json",
          ...config.headers,
        };
      } else {
        fetchConfig.body = config.data;
      }
    }

    // Gọi fetch
    const res = await fetch(url, fetchConfig);
    const response: APIResponse<T> = {
      data: await res.json().catch(() => null),
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      config,
      request: res,
    };

    // Áp dụng các interceptor cho response
    let processedResponse = response;
    for (const interceptor of this.interceptors.response) {
      processedResponse = await interceptor(processedResponse);
    }

    // Nếu phản hồi không thành công, ném lỗi
    if (!res.ok) {
      throw new APIError(processedResponse.statusText, processedResponse);
    }
    return processedResponse;
  }

  get<T = any>(
    url: string,
    config?: APIRequestConfig
  ): Promise<APIResponse<T>> {
    return this.request({ ...config, url, method: "GET" });
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: APIRequestConfig
  ): Promise<APIResponse<T>> {
    return this.request({ ...config, url, data, method: "POST" });
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: APIRequestConfig
  ): Promise<APIResponse<T>> {
    return this.request({ ...config, url, data, method: "PATCH" });
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: APIRequestConfig
  ): Promise<APIResponse<T>> {
    return this.request({ ...config, url, data, method: "PUT" });
  }

  delete<T = any>(
    url: string,
    config?: APIRequestConfig
  ): Promise<APIResponse<T>> {
    return this.request({ ...config, url, method: "DELETE" });
  }
}

// // Ví dụ sử dụng:

// // Tạo instance với cấu hình mặc định
// const api = new API({
//   baseUrl: "https://api.example.com",
//   headers: {
//     Authorization: "Bearer token",
//   },
// });

// // Thêm request interceptor
// api.interceptors.request.push(async (config) => {
//   console.log("Request config:", config);
//   // Bạn có thể thêm các xử lý như thêm token, logging,...
//   return config;
// });

// // Thêm response interceptor
// api.interceptors.response.push(async (response) => {
//   console.log("Response:", response);
//   // Bạn có thể kiểm tra, chuyển đổi dữ liệu response,...
//   return response;
// });

// // Gọi API giống axios
// (async () => {
//   try {
//     const { data, status } = await api.post<{ result: string }>("/endpoint", {
//       key: "value",
//     });
//     console.log("Data:", data, "Status:", status);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();
