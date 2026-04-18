import Cookies from "js-cookie";
import apiClient from "./api";
import type { AuthTokens, User } from "@/types";

export async function login(email: string, password: string): Promise<{ tokens: AuthTokens; user: User }> {
    const { data } = await apiClient.post<AuthTokens>("/auth/login/", { email, password });
    Cookies.set("access_token", data.access, { sameSite: "strict" });
    Cookies.set("refresh_token", data.refresh, { sameSite: "strict" });

    const { data: user } = await apiClient.get<User>("/auth/me/");
    return { tokens: data, user };
}

export async function register(payload: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
}): Promise<User> {
    const { data } = await apiClient.post<User>("/auth/register/", payload);
    return data;
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
