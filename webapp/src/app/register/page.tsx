"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import Link from "next/link";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h1>
                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { name: "first_name", label: "First Name", type: "text" },
                        { name: "last_name", label: "Last Name", type: "text" },
                        { name: "email", label: "Email", type: "email" },
                        { name: "password", label: "Password", type: "password" },
                        { name: "password_confirm", label: "Confirm Password", type: "password" },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            <input
                                name={field.name}
                                type={field.type}
                                value={form[field.name as keyof typeof form]}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
                    >
                        {loading ? "Creating account…" : "Register"}
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-500 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary-600 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
