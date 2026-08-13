"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Menu, Bell, Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { fetchMe } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Executive Dashboard", subtitle: "Monitor performance, pipeline health, and operational signals in one place." },
  "/crm": { title: "Customer Relationship Management", subtitle: "Keep your customer records organized, searchable, and actionable." },
  "/communications": { title: "Campaign Operations", subtitle: "Coordinate launches, delivery performance, and audience engagement." },
  "/analytics": { title: "Analytics", subtitle: "Review dashboards and evidence-based reporting across the platform." },
  "/commerce": { title: "Commerce", subtitle: "Track products, orders, and retail performance with operational clarity." },
  "/tracking": { title: "Tracking", subtitle: "Observe acquisition sessions and event ingestion across channels." },
  "/automation": { title: "Automation", subtitle: "Review workflow health and orchestration logic across customer journeys." },
  "/integrations": { title: "Integrations", subtitle: "Manage system connectivity, keys, and activation status." },
  "/identity": { title: "Identity", subtitle: "Resolve customer identities and inspect profile unification quality." },
  "/storefront": { title: "Storefront", subtitle: "Oversee storefront status, channel readiness, and launch posture." },
  "/logistics": { title: "Logistics", subtitle: "Track carriers, fulfillment status, and delivery visibility." },
  "/insights": { title: "Insights", subtitle: "Surface decision-ready recommendations and high-signal opportunities." },
  "/merchandising": { title: "Merchandising", subtitle: "Curate collections, banners, and rules that influence conversion." },
  "/segments": { title: "Segments", subtitle: "Define static and dynamic audience segments for precise customer targeting." },
  "/journeys": { title: "Journeys", subtitle: "Orchestrate multi-step customer journeys triggered by events, segments, or schedules." },
  "/messaging": { title: "Messaging", subtitle: "Manage customer message threads and conversations across all channels." },
  "/tenants": { title: "Tenant Management", subtitle: "Manage workspace tenants, team memberships, and access roles." },
  "/settings": { title: "Settings", subtitle: "Control workspace preferences, notifications, and operator defaults." },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const userName = user?.full_name?.trim() || "Mrkgron User";
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MG";

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    dispatch(fetchMe()).finally(() => setReady(true));
  }, [dispatch, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 24) {
        setHeaderVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      setHeaderVisible(currentScrollY > lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pageMeta = useMemo(() => {
    const match = Object.entries(pageTitles)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([route]) => pathname.startsWith(route));

    return match?.[1] ?? {
      title: "Workspace",
      subtitle: "Operate Mrkgron with consistency across teams, channels, and data flows.",
    };
  }, [pathname]);

  if (!ready) {
    return (
      <div className="app-shell-bg flex min-h-screen items-center justify-center px-6">
        <div className="app-surface w-full max-w-md p-10 text-center">
          <p className="page-eyebrow">Loading Workspace</p>
          <h1 className="page-title">Preparing your environment</h1>
          <p className="page-copy mx-auto">Mrkgron is validating your session and assembling the latest workspace data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell-bg min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          aria-label="Close navigation"
        />
      )}
      <div className="lg:pl-72">
        <header className={`sticky top-0 z-20 border-b border-black/10 bg-white transition-transform duration-300 ${headerVisible ? "translate-y-0" : "-translate-y-[115%]"}`}>
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-black/10 text-black transition hover:border-[#EE6C4D] hover:text-[#EE6C4D] lg:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#EE6C4D]">Operator workspace</p>
                <h1 className="mt-2 truncate text-2xl font-semibold text-black">{pageMeta.title}</h1>
                <p className="mt-1 hidden max-w-2xl text-sm text-black md:block">{pageMeta.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-black md:flex">
                <Search size={15} className="text-black" />
                Search workspace
              </div>
              <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-black/10 text-black transition hover:border-[#EE6C4D] hover:text-[#EE6C4D]">
                <Bell size={18} />
              </button>
              <Link href="/settings" className="flex items-center gap-3 rounded-md border border-black/10 bg-white px-3 py-2 transition hover:border-[#EE6C4D]">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-black text-sm font-medium text-white">
                  {userInitials}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium text-black">{userName}</p>
                  <p className="text-xs text-black">Workspace settings</p>
                </div>
              </Link>
            </div>
          </div>
        </header>
        <main id="main-content" className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}