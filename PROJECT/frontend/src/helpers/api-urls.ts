import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { EHttpMethod, IService } from "./types";

export const URLs = {
  UserLogin: "/api/users/signin",
  UserRegister: "/api/register",
  UserResetPasswordLink: "/user-auth/reset-password-link",
  ResetPassword: "/user-auth/reset-password",
  LoggedUserProfile: "/user-auth/profile",
};
export const baseURL = "http://localhost:4000/";
class HttpService {
  private http: AxiosInstance;
  // private baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  private baseURL = baseURL;

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
      withCredentials: false,
      headers: this.setupHeaders(),
    });
  }

  // Get authorization token for requests
  private get getAuthorization() {
    const accessToken = Cookies.get("AccessToken") || "";
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }

  // Initialize service configuration
  public service() {
    return this;
  }

  // Set up request headers
  private setupHeaders(
    hasAttachment?: boolean,
    additionalHeaders?: Record<string, string>
  ): Record<string, string> {
    const accessToken = localStorage.getItem("accessToken") || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...additionalHeaders,
      Authorization: `Bearer ${accessToken}`,
    };

    if (hasAttachment) {
      headers["Content-Type"] = "multipart/form-data";
    }

    return headers;
  }

  // Handle HTTP requests
  private async request<T>(
    method: EHttpMethod,
    url: string,
    options: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.request<T>({
        method,
        url,
        ...options,
      });

      return response.data;
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  // Perform GET request
  public async get<T>(
    url: string,
    params?: IService.IParams | any,
    hasAttachment = false
  ): Promise<T> {
    return this.request<T>(EHttpMethod.GET, url, {
      params,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  // Perform POST request
  public async post<T, P>(
    url: string,
    payload: P,
    params?: IService.IParams,
    additionalHeaders?: Record<string, string>,
    hasAttachment = false
  ): Promise<T> {
    return this.request<T>(EHttpMethod.POST, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment, additionalHeaders),
    });
  }

  // Perform UPDATE request
  public async put<T, P>(
    url: string,
    payload: P,
    params?: IService.IParams,
    hasAttachment = false
  ): Promise<T> {
    return this.request<T>(EHttpMethod.PUT, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  // Perform DELETE request
  public async remove<T>(
    url: string,
    params?: IService.IParams,
    hasAttachment = false
  ): Promise<T> {
    return this.request<T>(EHttpMethod.DELETE, url, {
      params,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  // Normalize errors
  private normalizeError(error: unknown) {
    return Promise.reject(error);
  }
}

export { HttpService as default };
