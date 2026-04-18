import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 30000,
});

// Attach JWT access token to every request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("access_token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    const tenantId = Cookies.get("tenant_id");
    if (tenantId) {
        config.headers["X-Tenant-ID"] = tenantId;
    }
    return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = Cookies.get("refresh_token");
            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
                        refresh: refreshToken,
                    });
                    Cookies.set("access_token", data.access);
                    if (originalRequest.headers) {
                        (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${data.access}`;
                    }
                    return apiClient(originalRequest);
                } catch {
                    Cookies.remove("access_token");
                    Cookies.remove("refresh_token");
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
