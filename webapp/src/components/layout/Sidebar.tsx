"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard, Users, Mail, BarChart2, ShoppingBag,
    Workflow, Settings, LogOut, Store, Truck, Tag,
    Lightbulb, Plug, Fingerprint, Activity,
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
    { href: "/integrations", label: "Integrations", icon: Plug },
    { href: "/identity", label: "Identity", icon: Fingerprint },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push("/login");
    };

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-primary-900 text-white flex flex-col z-30">
            <div className="px-6 py-5 border-b border-primary-700">
                <span className="text-xl font-bold tracking-tight">LizConMart</span>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-1 transition",
                            pathname.startsWith(href)
                                ? "bg-primary-700 text-white"
                                : "text-primary-200 hover:bg-primary-800 hover:text-white"
                        )}
                    >
                        <Icon size={18} />
                        {label}
                    </Link>
                ))}
            </nav>
            <div className="px-3 py-4 border-t border-primary-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-primary-200 hover:text-white hover:bg-primary-800 rounded-lg transition"
                >
                    <LogOut size={18} />
                    Sign out
                </button>
            </div>
        </aside>
    );
}
