"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/authSlice";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import type { AxiosError } from "axios";

function extractLoginError(err: unknown): string {
    const ax = err as AxiosError<Record<string, string[] | string>>;
    const data = ax?.response?.data;
    if (!data) return "Invalid email or password.";
    if (typeof data === "object" && "detail" in data) return String(data.detail);
    if (typeof data === "object" && "errors" in data) {
        const errors = (data as unknown as { errors: Record<string, string> }).errors;
        if (errors.detail) return String(errors.detail);
    }
    return "Invalid email or password.";
}

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            router.push("/dashboard");
        } catch (err) {
            setError(extractLoginError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            title="Access your workspace"
            subtitle="Sign in to manage campaigns, customer intelligence, and commerce operations from one controlled environment."
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-semibold text-brand-accent hover:text-brand-blue">
                        Create one
                    </Link>
                </>
            }
        >
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark">Sign in to Mrkgron</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
                Use your company email to enter the platform securely.
            </p>
            {error && (
                <p role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                <div>
                    <label htmlFor="login-email" className="label-text">Email address</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                        autoComplete="email"
                        placeholder="name@company.com"
                        aria-required="true"
                    />
                </div>
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label htmlFor="login-password" className="label-text mb-0">Password</label>
                        <Link href="/forgot-password" className="text-xs font-medium text-brand-accent hover:text-brand-blue">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field pr-10"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            aria-required="true"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? "Signing in..." : "Sign in"}
                    <ArrowRight size={16} />
                </button>
            </form>
        </AuthShell>
    );
}
