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
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient hero-grid">
      <div className="orb w-[600px] h-[600px] bg-brand-accent/20 -top-40 -left-40" />
      <div className="orb w-[500px] h-[500px] bg-brand-indigo/20 -bottom-40 -right-40" />
      <div className="orb w-[300px] h-[300px] bg-brand-cyan/10 top-1/3 right-1/4" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold tracking-widest uppercase mb-6">
          <Zap size={12} className="text-brand-gold" />
          Next-Generation Marketing Platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-white leading-[1.08] tracking-[-0.03em] max-w-5xl mx-auto">
          Unify Your{" "}
          <span className="gradient-text">Marketing,</span>{" "}
          <span className="text-brand-gold">Analytics,</span>{" "}
          and{" "}
          <span className="gradient-text">Commerce</span>
        </h1>

        <p className="mt-5 text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed">
          LizConMart empowers organizations with clarity, automation, and
          measurable results — marketing, analytics, and commerce in one
          integrated ecosystem.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/contact#demo" className="btn-gold text-base px-8 py-3.5">
            Request a Demo
            <ArrowRight size={16} />
          </Link>
          <Link href="/features" className="btn-primary text-base px-8 py-3.5">
            Explore Features
          </Link>
          <Link href="/register" className="btn-outline text-base px-8 py-3.5">
            Start Free Trial
          </Link>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/45 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-px">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-brand-gold text-brand-gold" />
              ))}
            </div>
            <span className="font-medium">4.9/5 from 1,200+ reviews</span>
          </div>
          <span className="hidden sm:block w-px h-3.5 bg-white/15" />
          <span className="font-medium">Trusted by 3,000+ businesses worldwide</span>
          <span className="hidden sm:block w-px h-3.5 bg-white/15" />
          <span className="font-medium">ISO 27001 Certified</span>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md overflow-hidden shadow-[0_40px_100px_-40px_rgba(0,0,0,0.55)]">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-black/25">
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
            <span className="ml-3 text-xs text-white/30">lizconmart.com/dashboard</span>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4">
            {[
              { label: "Revenue", value: "$2.4M", change: "+18%", color: "text-emerald-400" },
              { label: "Active Campaigns", value: "142", change: "+7%", color: "text-brand-accent" },
              { label: "Conversion Rate", value: "6.8%", change: "+1.2%", color: "text-brand-gold" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-left">
                <p className="text-xs text-white/40 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className={`text-xs font-medium mt-1 ${stat.color}`}>{stat.change} this month</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6">
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/40 uppercase tracking-wide">Campaign Performance</p>
                <span className="text-xs text-brand-accent">Live</span>
              </div>
              <div className="flex items-end gap-2 h-16">
                {[40, 65, 50, 80, 70, 90, 75, 95, 85, 100, 88, 92].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-brand-accent/60 to-brand-cyan/60"
                    style={{ height: `${h}%` }}
                  />
                ))}
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
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
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

