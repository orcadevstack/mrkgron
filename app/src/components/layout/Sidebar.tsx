"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/crm", label: "CRM" },
    { href: "/communications", label: "Campaigns" },
    { href: "/analytics", label: "Analytics" },
    { href: "/tracking", label: "Tracking" },
    { href: "/insights", label: "Insights" },
    { href: "/commerce", label: "Commerce" },
    { href: "/storefront", label: "Storefront" },
    { href: "/logistics", label: "Logistics" },
    { href: "/merchandising", label: "Merchandising" },
    { href: "/automation", label: "Automation" },
    { href: "/segments", label: "Segments" },
    { href: "/journeys", label: "Journeys" },
    { href: "/messaging", label: "Messaging" },
    { href: "/integrations", label: "Integrations" },
    { href: "/identity", label: "Identity" },
    { href: "/tenants", label: "Tenants" },
    { href: "/settings", label: "Settings" },
];

type SidebarProps = {
    mobileOpen?: boolean;
    onNavigate?: () => void;
};

export function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push("/login");
    };

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-black/10 bg-white text-black transition-transform duration-300 lg:translate-x-0",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="border-b border-black/10 px-6 py-6">
                <BrandLogo size="md" subtitle="Operations" onClick={onNavigate} />
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-5">
                {navItems.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        className={cn(
                            "mb-1 flex items-center border-l-2 px-4 py-3 text-sm font-medium transition",
                            pathname === href || pathname.startsWith(`${href}/`)
                                ? "border-[#EE6C4D] bg-black text-white"
                                : "border-transparent text-black/70 hover:border-black hover:text-black"
                        )}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
            <div className="border-t border-black/10 px-4 py-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center border-l-2 border-transparent px-4 py-3 text-sm text-black/70 transition hover:border-[#EE6C4D] hover:text-black"
                >
                    Sign out
                </button>
            </div>
        </aside>
    );
}
