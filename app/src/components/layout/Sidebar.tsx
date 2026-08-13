"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
    LayoutDashboard, Users, Mail, BarChart2, ShoppingBag,
    Workflow, Settings, LogOut, Store, Truck, Tag,
    Lightbulb, Plug, Fingerprint, Activity,
    Filter, Route, MessageSquare, Building2,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/crm", label: "CRM", icon: Users },
    { href: "/communications", label: "Campaigns", icon: Mail },
    { href: "/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/tracking", label: "Tracking", icon: Activity },
    { href: "/insights", label: "Insights", icon: Lightbulb },
    { href: "/commerce", label: "Commerce", icon: ShoppingBag },
    { href: "/storefront", label: "Storefront", icon: Store },
    { href: "/logistics", label: "Logistics", icon: Truck },
    { href: "/merchandising", label: "Merchandising", icon: Tag },
    { href: "/automation", label: "Automation", icon: Workflow },
    { href: "/segments", label: "Segments", icon: Filter },
    { href: "/journeys", label: "Journeys", icon: Route },
    { href: "/messaging", label: "Messaging", icon: MessageSquare },
    { href: "/integrations", label: "Integrations", icon: Plug },
    { href: "/identity", label: "Identity", icon: Fingerprint },
    { href: "/tenants", label: "Tenants", icon: Building2 },
    { href: "/settings", label: "Settings", icon: Settings },
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
                "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-brand-dark text-white shadow-2xl shadow-black/20 transition-transform duration-300 lg:translate-x-0",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="border-b border-white/10 px-6 py-6">
                <BrandLogo tone="light" size="md" subtitle="Operations" onClick={onNavigate} />
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-5">
                {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        className={cn(
                            "mb-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                            pathname === href || pathname.startsWith(`${href}/`)
                                ? "bg-white/10 text-white shadow-inner"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <Icon size={18} />
                        {label}
                    </Link>
                ))}
            </nav>
            <div className="border-t border-white/10 px-4 py-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
                >
                    <LogOut size={18} />
                    Sign out
                </button>
            </div>
        </aside>
    );
}
