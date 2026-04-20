import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  MessageSquare,
  ShoppingCart,
  CheckCircle2,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  Users,
  Layers,
  ChevronRight,
  Star,
} from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

/* ─── Hero Section ───────────────────────────────────────────── */
/* ─── Hero Section ───────────────────────────────────────────── */
function HeroSection() {
  const stats = [
    { label: "Net revenue", value: "$2.4M", delta: "+18% MoM", tone: "text-emerald-400" },
    { label: "Campaigns active", value: "142", delta: "+7% this month", tone: "text-blue-400" },
    { label: "Conversion rate", value: "6.8%", delta: "+1.2 pts", tone: "text-amber-400" },
  ];

  const coverage = [
    { label: "Communications orchestration", value: 96 },
    { label: "Analytics visibility", value: 99 },
    { label: "Commerce readiness", value: 94 },
  ];

  const bars = [42, 58, 54, 72, 66, 84, 76, 90, 82, 98, 86, 94];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-28 text-white lg:pt-32">

      {/* decorative blobs — pure bg-color + blur, zero background-image */}
      <div className="pointer-events-none absolute -left-40 -top-32 h-[600px] w-[600px] rounded-full bg-blue-600/14 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 top-20 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-indigo-600/12 blur-[80px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28 xl:grid-cols-2 xl:items-center">

        {/* ── Left: copy ── */}
        <div className="max-w-2xl text-center xl:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/78">
            <Zap size={12} className="text-amber-400" />
            Institutional Marketing Operating System
          </div>

          <h1 className="mt-7 text-[2.6rem] font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl md:text-[3.6rem] lg:text-[4.2rem] xl:text-[4.8rem]">
            Operate{" "}
            <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Marketing, Analytics,
            </span>{" "}
            and Commerce with executive-grade clarity.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
            LizConMart gives disciplined organizations one authoritative command surface for campaigns,
            customer intelligence, and digital commerce execution — without fragmented tools or weak reporting.
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center xl:justify-start">
            <Link href="/contact#demo" className="btn-gold w-full px-8 py-3.5 text-base sm:w-auto">
              Request a Demo <ArrowRight size={16} />
            </Link>
            <Link href="/features" className="btn-primary w-full px-8 py-3.5 text-base sm:w-auto">
              Explore Features
            </Link>
            <Link href="/register" className="btn-outline w-full px-8 py-3.5 text-base sm:w-auto">
              Start Free Trial
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-center xl:justify-start">
            <div className="flex items-center justify-center gap-2">
              <div className="flex -space-x-px">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-medium text-white/80">4.9 / 5 from 1,200+ reviews</span>
            </div>
            <span className="hidden text-white/25 sm:inline">·</span>
            <span className="text-center font-medium text-white/80">Trusted by 3,000+ businesses</span>
            <span className="hidden text-white/25 sm:inline">·</span>
            <span className="text-center font-medium text-white/80">ISO 27001 Certified</span>
          </div>
        </div>

        {/* ── Right: live dashboard card ── */}
        <div className="w-full rounded-[32px] border border-white/12 bg-white/6 p-4 shadow-[0_48px_140px_-52px_rgba(2,8,23,0.8)] backdrop-blur-md sm:p-5 lg:p-6">

          {/* Header bar */}
          <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-slate-950/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">Control Center</p>
              <p className="mt-1 text-sm font-semibold text-white/88">LizConMart Executive Workspace</p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live operations
            </div>
          </div>

          <div className="mt-4 grid gap-4 2xl:grid-cols-[1.15fr_0.85fr]">
            {/* Main panel */}
            <div className="rounded-[26px] border border-white/12 bg-slate-950/30 p-5 backdrop-blur-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">Performance Snapshot</p>
                  <h2 className="mt-2 text-[1.3rem] font-semibold leading-tight text-white">Command the full operating picture</h2>
                </div>
                <span className="w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/65">
                  Updated 2m ago
                </span>
              </div>

              {/* KPI tiles */}
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{s.label}</p>
                    <p className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white">{s.value}</p>
                    <p className={`mt-2 text-xs font-semibold ${s.tone}`}>{s.delta}</p>
                  </div>
                ))}
              </div>

              {/* Bar chart — pure CSS flex divs, no SVG or image */}
              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">Campaign Momentum</p>
                  <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-[11px] font-semibold text-blue-300">Operationally healthy</span>
                </div>
                <div className="mt-4 flex h-24 items-end gap-[3px]">
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-500/80 via-indigo-500/70 to-cyan-400/80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Side panels */}
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-1">
              <div className="rounded-[26px] border border-white/12 bg-slate-950/30 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">Strategic Signal</p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/55">Signal 01</span>
                </div>
                <h3 className="mt-3 text-base font-semibold leading-snug text-white">Executive control center</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">Unified visibility across communications, analytics, and commerce operations.</p>
              </div>

              <div className="rounded-[26px] border border-white/12 bg-slate-950/30 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">Strategic Signal</p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/55">Signal 02</span>
                </div>
                <h3 className="mt-3 text-base font-semibold leading-snug text-white">Institutional reliability</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">Clear governance, measurable performance, and decision-grade reporting in one surface.</p>
              </div>

              {/* Progress bars */}
              <div className="rounded-[26px] border border-white/12 bg-slate-950/30 p-5 backdrop-blur-md">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">Execution Coverage</p>
                <div className="mt-4 space-y-3">
                  {coverage.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      <div className="flex items-center justify-between text-sm text-white/75">
                        <span>{item.label}</span>
                        <span className="font-semibold text-white">{item.value}%</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Key Modules ────────────────────────────────────────────── */
const modules = [
  {
    icon: MessageSquare,
    color: "bg-blue-500/10 text-blue-400",
    tag: "Communications",
    tagColor: "bg-blue-500/10 text-blue-400",
    title: "Digital Communications & Customer Engagement",
    description:
      "Orchestrate multi-channel journeys with CRM-driven personalization, automated workflows, and retention programs that keep customers coming back.",
    features: [
      "Multi-channel campaign management",
      "Automated customer journeys",
      "CRM-driven personalization",
      "Segmentation & retention programs",
      "Performance optimization",
    ],
    href: "/features#communications",
  },
  {
    icon: BarChart3,
    color: "bg-indigo-500/10 text-indigo-400",
    tag: "Analytics",
    tagColor: "bg-indigo-500/10 text-indigo-400",
    title: "Data Analytics, Insights & Business Intelligence",
    description:
      "Unlock the power of unified dashboards, behavioral forecasting, and evidence-based decision-making to drive measurable business outcomes.",
    features: [
      "Unified real-time dashboards",
      "Behavioral insights & segmentation",
      "Predictive forecasting models",
      "Cross-channel performance tracking",
      "Evidence-based decision intelligence",
    ],
    href: "/features#analytics",
  },
  {
    icon: ShoppingCart,
    color: "bg-amber-500/10 text-amber-400",
    tag: "Commerce",
    tagColor: "bg-amber-500/10 text-amber-400",
    title: "E-Commerce Growth & Digital Retail Operations",
    description:
      "Build and scale digital retail with storefront management, product catalog tools, conversion optimization, and seamless payment and logistics integration.",
    features: [
      "Storefront setup & management",
      "Product catalog & merchandising",
      "Conversion optimization tools",
      "Payment & logistics integration",
      "Customer experience design",
    ],
    href: "/features#commerce",
  },
];

function ModulesSection() {
  return (
    <section className="py-24 bg-white" id="modules">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="tag-pill bg-brand-accent/10 text-brand-accent mb-4">
            Platform Capabilities
          </span>
          <h2 className="section-heading mt-3">
            Everything your business needs,{" "}
            <span className="gradient-text">in one platform</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            Three powerful modules — communications, analytics, and commerce —
            unified to give your organization an unfair competitive advantage.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.tag} className="card-feature flex flex-col group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${mod.color}`}>
                  <Icon size={22} />
                </div>
                <span className={`tag-pill mb-3 ${mod.tagColor}`}>{mod.tag}</span>
                <h3 className="text-lg font-bold text-brand-dark leading-snug mb-3">
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">
                  {mod.description}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {mod.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={15} className="text-brand-accent mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={mod.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent group-hover:gap-2.5 transition-all"
                >
                  Learn more <ChevronRight size={15} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────── */
function StatsSection() {
  const stats = [
    { value: "3,000+", label: "Businesses worldwide" },
    { value: "99.9%", label: "Platform uptime SLA" },
    { value: "6×", label: "Average ROI for customers" },
    { value: "50M+", label: "Customer interactions/month" },
  ];
  return (
    <section className="py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/50 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Differentiators ────────────────────────────────────────── */
const differentiators = [
  { icon: Layers,    title: "Unified Ecosystem",       desc: "Marketing, analytics, and commerce in a single platform — no siloed tools, no fragmented data." },
  { icon: Shield,    title: "Enterprise-Grade Security", desc: "Built on Django with SOC 2 compliance, role-based access, and end-to-end encryption." },
  { icon: Zap,       title: "Automation-First Design",  desc: "Intelligent workflows that trigger at the right moment, reducing manual effort and human error." },
  { icon: TrendingUp,title: "Scalable Architecture",    desc: "From startup to enterprise — the platform grows with your business needs without replatforming." },
  { icon: Globe,     title: "Global Operations",        desc: "Multi-currency, multi-language, and multi-region support for organizations operating worldwide." },
  { icon: Users,     title: "Customer-Centric AI",      desc: "AI-powered segmentation, recommendations, and predictive analytics centered on real customer behavior." },
];

function DifferentiatorsSection() {
  return (
    <section className="py-24 bg-brand-light" id="why-lizconmart">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="tag-pill bg-brand-indigo/10 text-brand-indigo mb-4">
            Why LizConMart
          </span>
          <h2 className="section-heading mt-3">
            Competitive <span className="gradient-text">differentiation</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            Built from the ground up for modern organizations that demand
            clarity, speed, and measurable growth.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentiators.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-indigo/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-indigo/10 flex items-center justify-center mb-4 group-hover:bg-brand-indigo/20 transition-colors">
                  <Icon size={20} className="text-brand-indigo" />
                </div>
                <h3 className="font-bold text-brand-dark mb-2">{d.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{d.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Audience ───────────────────────────────────────────────── */
function AudienceSection() {
  const audiences = [
    {
      label: "Enterprises",
      color: "border-brand-blue bg-brand-blue/5",
      iconBg: "bg-brand-blue/10 text-brand-blue",
      Icon: Globe,
      points: ["Scalable multi-tenant architecture", "Advanced compliance & security", "Custom analytics & reporting", "Dedicated enterprise support"],
    },
    {
      label: "SMEs",
      color: "border-brand-accent bg-brand-accent/5",
      iconBg: "bg-brand-accent/10 text-brand-accent",
      Icon: TrendingUp,
      featured: true,
      points: ["Easy-to-use intuitive interface", "Affordable, flexible pricing", "Quick 48-hour deployment", "Pre-built campaign templates"],
    },
    {
      label: "Startups",
      color: "border-brand-gold bg-brand-gold/5",
      iconBg: "bg-brand-gold/10 text-brand-gold",
      Icon: Zap,
      points: ["Growth-focused modules", "Automation from day one", "Integrated commerce suite", "Developer-friendly APIs"],
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="tag-pill bg-brand-gold/10 text-amber-700 mb-4">
            Solutions for every stage
          </span>
          <h2 className="section-heading mt-3">
            Built for <span className="text-brand-gold">your</span> business
          </h2>
          <p className="section-subheading mx-auto text-center">
            Whether you are a global enterprise, a growing SME, or an ambitious
            startup — LizConMart has a solution designed for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((a) => (
            <div
              key={a.label}
              className={`rounded-2xl p-7 border-2 ${a.color} ${
                a.featured ? "ring-2 ring-brand-accent/30 shadow-lg" : ""
              } relative`}
            >
              {a.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 tag-pill bg-brand-accent text-white text-xs">
                  Most Popular
                </span>
              )}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${a.iconBg}`}>
                <a.Icon size={20} />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4">For {a.label}</h3>
              <ul className="space-y-2.5">
                {a.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="text-brand-accent mt-0.5 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
              <Link
                href="/solutions"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent hover:gap-3 transition-all"
              >
                Explore solutions <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Messaging CTA ──────────────────────────────────────────── */
function MessagingSection() {
  const messages = [
    { text: "Clarity in every campaign.", icon: BarChart3 },
    { text: "Automation that scales with you.", icon: Zap },
    { text: "Commerce and analytics in one ecosystem.", icon: ShoppingCart },
  ];

  return (
    <section className="py-20 bg-hero-gradient hero-grid relative overflow-hidden">
      <div className="orb w-96 h-96 bg-brand-accent/20 top-0 left-1/4" />
      <div className="orb w-80 h-80 bg-brand-gold/10 bottom-0 right-1/4" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 leading-tight">
          Three promises. <span className="text-brand-gold">One platform.</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {messages.map(({ text, icon: Icon }) => (
            <div
              key={text}
              className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-7 hover:bg-white/20 transition-colors"
            >
              <Icon size={28} className="text-brand-gold mb-4 mx-auto" />
              <p className="text-white font-semibold text-lg">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact#demo" className="btn-gold text-base px-8 py-3.5">
            Request a Demo <ArrowRight size={16} />
          </Link>
          <Link href="/pricing" className="btn-outline text-base px-8 py-3.5">
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export const metadata = {
  title: "LizConMart — Unify Your Marketing, Analytics, and Commerce",
  description: "LizConMart empowers organizations with clarity, automation, and measurable results — marketing, analytics, and commerce in one ecosystem.",
  openGraph: {
    title: "LizConMart — Unify Your Marketing, Analytics, and Commerce",
    description: "LizConMart empowers organizations with clarity, automation, and measurable results.",
    url: "https://lizconmart.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "LizConMart — Marketing, Analytics, and Commerce",
    description: "One platform. Every tool your business needs to grow.",
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ModulesSection />
        <StatsSection />
        <DifferentiatorsSection />
        <AudienceSection />
        <MessagingSection />
      </main>
      <Footer />
    </>
  );
}

