"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import apiClient from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await apiClient.post("/auth/password-reset/", { email });
        } catch {
            // Always show success to prevent email enumeration (security best practice)
        } finally {
            setLoading(false);
            setSubmitted(true);
        }
    };

    return (
        <AuthShell
            title="Reset your password"
            subtitle="Enter the email address associated with your account and we'll send you reset instructions."
            footer={
                <>
                    Remembered your password?{" "}
                    <Link href="/login" className="font-semibold text-brand-accent hover:text-brand-blue">
                        Sign in
                    </Link>
                </>
            }
        >
            {submitted ? (
                <div className="space-y-4 text-center py-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                        <CheckCircle2 size={28} className="text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-brand-dark">Check your inbox</h2>
                    <p className="text-sm text-slate-500 leading-6">
                        If an account exists for <span className="font-medium text-brand-dark">{email}</span>,
                        you&apos;ll receive an email with password reset instructions within a few minutes.
                    </p>
                    <p className="text-xs text-slate-400">
                        Didn&apos;t receive it? Check your spam folder or{" "}
                        <button
                            onClick={() => setSubmitted(false)}
                            className="font-medium text-brand-accent hover:text-brand-blue"
                        >
                            try again
                        </button>.
                    </p>
                    <Link
                        href="/login"
                        className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-accent hover:text-brand-blue"
                    >
                        <ArrowLeft size={14} />
                        Back to sign in
                    </Link>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold tracking-tight text-brand-dark">Forgot your password?</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Enter your work email and we&apos;ll send reset instructions if the account exists.
                    </p>
                    {error && (
                        <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="reset-email" className="label-text">
                                Email address
                            </label>
                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                                autoComplete="email"
                                placeholder="name@company.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Sending reset link..." : "Send reset link"}
                            <ArrowRight size={16} />
                        </button>
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-brand-dark"
                        >
                            <ArrowLeft size={14} />
                            Back to sign in
                        </Link>
                    </form>
                </>
            )}
        </AuthShell>
    );
}
