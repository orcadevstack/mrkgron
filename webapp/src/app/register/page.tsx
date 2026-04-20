"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/authSlice";
import { register } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import type { AxiosError } from "axios";

type FieldErrors = Partial<Record<string, string[]>>;

function extractErrors(err: unknown): { general: string; fields: FieldErrors } {
    const ax = err as AxiosError<Record<string, string[] | string>>;
    const data = ax?.response?.data;
    if (!data) return { general: "Registration failed. Please try again.", fields: {} };
    // If data has a "detail" key it's a general message
    if (typeof data === "object" && "detail" in data) {
        return { general: String(data.detail), fields: {} };
    }
    // Otherwise it's field-level errors e.g. { email: ["already exists"], password: ["too weak"] }
    const fields: FieldErrors = {};
    let general = "";
    for (const [key, val] of Object.entries(data)) {
        if (key === "non_field_errors") {
            general = Array.isArray(val) ? val.join(" ") : String(val);
        } else {
            fields[key] = Array.isArray(val) ? val : [String(val)];
        }
    }
    return { general, fields };
}

const passwordRules = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "At least one number", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        password_confirm: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        // Clear field error on change
        if (fieldErrors[e.target.name]) {
            setFieldErrors((fe) => { const next = { ...fe }; delete next[e.target.name]; return next; });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        setFieldErrors({});

        if (form.password !== form.password_confirm) {
            setFieldErrors({ password_confirm: ["Passwords do not match."] });
            return;
        }

        setLoading(true);
        try {
            const { user } = await register({
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
                password: form.password,
                password_confirm: form.password_confirm,
            });
            dispatch(setUser(user));
            router.push("/dashboard");
        } catch (err) {
            const { general, fields } = extractErrors(err);
            setGeneralError(general);
            setFieldErrors(fields);
        } finally {
            setLoading(false);
        }
    };

    const pwStrength = passwordRules.filter((r) => r.test(form.password));
    const showStrength = form.password.length > 0;

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

            {generalError && (
                <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {generalError}
                </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                {/* Name row */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="reg-first-name" className="label-text">First name</label>
                        <input
                            id="reg-first-name"
                            name="first_name"
                            type="text"
                            value={form.first_name}
                            onChange={handleChange}
                            required
                            autoComplete="given-name"
                            className={`input-field ${fieldErrors.first_name ? "border-red-400 focus:ring-red-400/30" : ""}`}
                            placeholder="Elizabeth"
                        />
                        {fieldErrors.first_name && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.first_name.join(" ")}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="reg-last-name" className="label-text">Last name</label>
                        <input
                            id="reg-last-name"
                            name="last_name"
                            type="text"
                            value={form.last_name}
                            onChange={handleChange}
                            required
                            autoComplete="family-name"
                            className={`input-field ${fieldErrors.last_name ? "border-red-400 focus:ring-red-400/30" : ""}`}
                            placeholder="Connors"
                        />
                        {fieldErrors.last_name && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.last_name.join(" ")}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="reg-email" className="label-text">Work email</label>
                    <input
                        id="reg-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className={`input-field ${fieldErrors.email ? "border-red-400 focus:ring-red-400/30" : ""}`}
                        placeholder="name@company.com"
                    />
                    {fieldErrors.email && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.email.join(" ")}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="reg-password" className="label-text">Password</label>
                    <div className="relative">
                        <input
                            id="reg-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            className={`input-field pr-10 ${fieldErrors.password ? "border-red-400 focus:ring-red-400/30" : ""}`}
                            placeholder="Create a strong password"
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
                    {fieldErrors.password && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.password.join(" ")}</p>
                    )}
                    {showStrength && (
                        <ul className="mt-2 space-y-1">
                            {passwordRules.map((rule) => {
                                const passed = rule.test(form.password);
                                return (
                                    <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${passed ? "text-green-600" : "text-slate-400"}`}>
                                        <CheckCircle2 size={12} className={passed ? "text-green-500" : "text-slate-300"} />
                                        {rule.label}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {showStrength && (
                        <div className="mt-2 flex gap-1">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1 flex-1 rounded-full transition-colors ${
                                        pwStrength.length >= i
                                            ? i === 3 ? "bg-green-500" : i === 2 ? "bg-yellow-400" : "bg-red-400"
                                            : "bg-slate-200"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Confirm password */}
                <div>
                    <label htmlFor="reg-password-confirm" className="label-text">Confirm password</label>
                    <div className="relative">
                        <input
                            id="reg-password-confirm"
                            name="password_confirm"
                            type={showConfirm ? "text" : "password"}
                            value={form.password_confirm}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            className={`input-field pr-10 ${fieldErrors.password_confirm ? "border-red-400 focus:ring-red-400/30" : ""}`}
                            placeholder="Repeat your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {fieldErrors.password_confirm && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.password_confirm.join(" ")}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Create account"}
                    <ArrowRight size={16} />
                </button>

                <p className="text-center text-xs text-slate-400">
                    By creating an account you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-brand-dark">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="underline hover:text-brand-dark">Privacy Policy</Link>.
                </p>
            </form>
        </AuthShell>
    );
}
