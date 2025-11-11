// src/services/api/client.ts
/**
 * Base API Client
 * Provides common HTTP client functionality with auth and error handling
 */

import axios, { AxiosInstance, AxiosError } from "axios";

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

class APIClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ error?: APIError }>) => {
        const apiError: APIError = {
          code: "UNKNOWN_ERROR",
          message: "An unknown error occurred",
        };

        if (error.response?.data?.error) {
          apiError.code = error.response.data.error.code;
          apiError.message = error.response.data.error.message;
          apiError.details = error.response.data.error.details;
        } else if (error.message) {
          apiError.message = error.message;
        }

        console.error("API Error:", apiError);
        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export default APIClient;
