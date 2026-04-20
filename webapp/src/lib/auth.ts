import Cookies from "js-cookie";
import apiClient from "./api";
import type { AuthLoginResponse, AuthTokens, User } from "@/types";

/** Store JWT tokens in cookies */
export function storeTokens(access: string, refresh: string) {
    Cookies.set("access_token", access, { sameSite: "strict" });
    Cookies.set("refresh_token", refresh, { sameSite: "strict" });
}

export async function login(email: string, password: string): Promise<{ tokens: AuthTokens; user: User }> {
    const { data } = await apiClient.post<AuthLoginResponse>("/auth/login/", { email, password });
    storeTokens(data.access, data.refresh);
    return { tokens: { access: data.access, refresh: data.refresh }, user: data.user };
}

export async function register(payload: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
}): Promise<{ tokens: AuthTokens; user: User }> {
    const { data } = await apiClient.post<AuthLoginResponse>("/auth/register/", payload);
    storeTokens(data.access, data.refresh);
    return { tokens: { access: data.access, refresh: data.refresh }, user: data.user };
}

export async function logout(): Promise<void> {
    const refresh = Cookies.get("refresh_token");
    if (refresh) {
        await apiClient.post("/auth/logout/", { refresh }).catch(() => null);
    }
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("tenant_id");
}

export async function getMe(): Promise<User> {
    const { data } = await apiClient.get<User>("/auth/me/");
    return data;
}
