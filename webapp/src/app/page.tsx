import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
            <h1 className="text-5xl font-bold tracking-tight">LizConMart</h1>
            <p className="text-xl text-primary-100 max-w-md text-center">
                Enterprise Marketing Automation, CRM, Analytics &amp; Commerce Platform
            </p>
            <div className="flex gap-4">
                <Link
                    href="/login"
                    className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition"
                >
                    Sign In
                </Link>
                <Link
                    href="/dashboard"
                    className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
                >
                    Dashboard
                </Link>
            </div>
        </main>
    );
}
