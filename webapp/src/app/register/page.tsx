"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", first_name: "", last_name: "", password: "", password_confirm: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.password_confirm) { setError("Passwords do not match."); return; }
        setLoading(true); setError("");
        try {
            await apiClient.post("/auth/register/", form);
            router.push("/login");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Registration failed.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            title="Create your operator account"
            subtitle="Set up secure access for your LizConMart workspace and bring marketing, analytics, and commerce into one operating layer."
            footer={
                <>
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-brand-accent hover:text-brand-blue">
                        Sign in
                    </Link>
                </>
            }
        >
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark">Create your account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
                Start with the essentials. You can refine team and tenant settings after registration.
            </p>
            {error && <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    {[
                        { name: "first_name", label: "First name", type: "text" },
                        { name: "last_name", label: "Last name", type: "text" },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="label-text">{field.label}</label>
                            <input
                                name={field.name}
                                type={field.type}
                                value={form[field.name as keyof typeof form]}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>
                    ))}
                </div>
                {[
                    { name: "email", label: "Work email", type: "email", placeholder: "name@company.com" },
                    { name: "password", label: "Password", type: "password", placeholder: "Create a strong password" },
                    { name: "password_confirm", label: "Confirm password", type: "password", placeholder: "Repeat your password" },
                ].map((field) => (
                    <div key={field.name}>
                        <label className="label-text">{field.label}</label>
                        <input
                            name={field.name}
                            type={field.type}
                            value={form[field.name as keyof typeof form]}
                            onChange={handleChange}
                            required
                            placeholder={field.placeholder}
                            className="input-field"
                        />
                    </div>
                ))}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? "Creating account..." : "Create account"}
                    <ArrowRight size={16} />
                </button>
            </form>
        </AuthShell>
    );
}
