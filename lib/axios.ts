export class FetchApiError<T = any> extends Error {
  isFetchApiError: boolean;
  response: FetchApiResponse<T>;
  config: FetchApiRequestConfig;

  constructor(message: string, response: FetchApiResponse<T>) {
    super(message);
    this.name = "FechApiError";
    this.isFetchApiError = true;
    this.response = response;
    this.config = response.config;
  }
}

interface FetchApiRequestConfig extends RequestInit {
  url?: string;
  baseUrl?: string;
  params?: Record<string, any>;
  data?: any;
}

interface FetchApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: FetchApiRequestConfig;
  request: Response;
}

type RequestInterceptor = (
  config: FetchApiRequestConfig
) => FetchApiRequestConfig | Promise<FetchApiRequestConfig>;

type ResponseInterceptor<T = any> = (
  response: FetchApiResponse<T>
) => FetchApiResponse<T> | Promise<FetchApiResponse<T>>;

export class FetchAPI {
  defaults: FetchApiRequestConfig;
  interceptors: {
    request: RequestInterceptor[];
    response: ResponseInterceptor[];
  };

  constructor(defaults: FetchApiRequestConfig = {}) {
    this.defaults = defaults;
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  static create(defaults: FetchApiRequestConfig = {}): FetchAPI {
    return new FetchAPI(defaults);
  }

  private async request<T = any>(
    config: FetchApiRequestConfig
  ): Promise<FetchApiResponse<T>> {
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
    const response: FetchApiResponse<T> = {
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
      throw new FetchApiError(processedResponse.statusText, processedResponse);
    }
    return processedResponse;
  }

  get<T = any>(
    url: string,
    config?: FetchApiRequestConfig
  ): Promise<FetchApiResponse<T>> {
    return this.request({ ...config, url, method: "GET" });
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: FetchApiRequestConfig
  ): Promise<FetchApiResponse<T>> {
    return this.request({ ...config, url, data, method: "POST" });
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: FetchApiRequestConfig
  ): Promise<FetchApiResponse<T>> {
    return this.request({ ...config, url, data, method: "PUT" });
  }

  delete<T = any>(
    url: string,
    config?: FetchApiRequestConfig
  ): Promise<FetchApiResponse<T>> {
    return this.request({ ...config, url, method: "DELETE" });
  }
}

// // Ví dụ sử dụng:

// // Tạo instance với cấu hình mặc định
// const api = new FetchAPI({
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
