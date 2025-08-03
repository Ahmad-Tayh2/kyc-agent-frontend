import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

export interface ErrorResponseData {
  message: string;
  status: boolean;
}

import { getAuthHeaders } from "@/lib/utils";

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    // baseURL: "",
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const authHeaders = getAuthHeaders();

      if (authHeaders) {
        Object.assign(config.headers as AxiosHeaders, authHeaders);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

// Export the created instance
const apiClient = createAxiosInstance();
export default apiClient;
