"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/authSlice";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            router.push("/dashboard");
        } catch {
            setError("Invalid email or password.");
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
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark">Sign in to LizConMart</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
                Use your company email to enter the platform securely.
            </p>
            {error && <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                    <label className="label-text">Email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                        autoComplete="email"
                        placeholder="name@company.com"
                    />
                </div>
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label className="label-text mb-0">Password</label>
                        <Link href="/contact" className="text-xs font-medium text-brand-accent hover:text-brand-blue">
                            Need access help?
                        </Link>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? "Signing in..." : "Sign in"}
                    <ArrowRight size={16} />
                </button>
            </form>
        </AuthShell>
    );
}
