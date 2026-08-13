import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bell,
  Boxes,
  BrainCircuit,
  Database,
  FileBarChart,
  Fingerprint,
  Gauge,
  KeyRound,
  Layers,
  LineChart,
  Lock,
  Megaphone,
  PieChart,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";

/* ─── Section 2 — Value Proposition Grid ─────────────────────── */

const valueBlocks = [
  {
    icon: Database,
    title: "Unified Data Layer",
    description:
      "All your marketing, commerce, and analytics data in one governed place — reconciled, deduplicated, and ready for decisions.",
    points: ["Single source of truth", "Cross-domain joins", "Governed definitions"],
  },
  {
    icon: Activity,
    title: "Real-Time Intelligence",
    description:
      "Live dashboards, instant alerts, and predictive insights that surface what changed before it becomes a problem.",
    points: ["Live dashboards", "Threshold alerts", "Predictive signals"],
  },
  {
    icon: Workflow,
    title: "Enterprise Automation",
    description:
      "AI-powered recommendations and automated workflows that turn insight into execution without manual handoffs.",
    points: ["Trigger-based rules", "Guided recommendations", "Scheduled operations"],
  },
  {
    icon: FileBarChart,
    title: "Executive Reporting",
    description:
      "Board-ready reports generated automatically, with the narrative and figures leadership expects.",
    points: ["Automated summaries", "Scheduled delivery", "Export to PDF"],
  },
];

export function ValuePropositionSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-enterprise-blue/10 blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-enterprise-gold">
            Why Mrkgron
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
            One Platform. Every Insight. Total Control.
          </h2>
          <p className="mt-5 text-base leading-8 text-white/70 sm:text-lg">
            Replace fragmented tools with a single intelligence layer that connects every
            department to the same numbers, the same definitions, and the same truth.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valueBlocks.map((block) => (
            <div
              key={block.title}
              className="group rounded-[26px] border border-white/12 bg-white/[0.04] p-6 transition duration-300 hover:border-enterprise-blue/40 hover:bg-white/[0.07]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-enterprise-blue/15 text-enterprise-blue transition group-hover:bg-enterprise-blue/25">
                <block.icon size={20} />
              </div>
              <h3 className="mt-5 text-lg font-semibold leading-snug text-white">{block.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{block.description}</p>
              <ul className="mt-5 space-y-2 border-t border-white/10 pt-5">
                {block.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-xs font-medium text-white/60">
                    <BadgeCheck size={13} className="shrink-0 text-enterprise-gold" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 3 — Live Dashboard Preview ─────────────────────── */

const previewMetrics = [
  { label: "Net revenue", value: "$2.4M", delta: "+18.2%", tone: "text-emerald-400" },
  { label: "Marketing spend", value: "$412K", delta: "-6.4%", tone: "text-emerald-400" },
  { label: "Blended ROAS", value: "5.8x", delta: "+0.7x", tone: "text-emerald-400" },
  { label: "Conversion rate", value: "6.8%", delta: "+1.2 pts", tone: "text-emerald-400" },
];

const previewChannels = [
  { name: "Paid search", share: 34, revenue: "$816K" },
  { name: "Paid social", share: 27, revenue: "$648K" },
  { name: "Email & lifecycle", share: 21, revenue: "$504K" },
  { name: "Organic & direct", share: 18, revenue: "$432K" },
];

const forecastBars = [52, 61, 57, 68, 74, 71, 83, 88, 84, 92, 96, 99];

export function DashboardPreviewSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#0A1A2F] to-slate-950 py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute -left-32 top-24 h-[460px] w-[460px] rounded-full bg-enterprise-blue/12 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-enterprise-gold">
            Live dashboard preview
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
            See Your Business Like Never Before.
          </h2>
          <p className="mt-5 text-base leading-8 text-white/70 sm:text-lg">
            Revenue trends, customer segmentation, funnel performance, product analytics,
            marketing attribution, and predictive forecasting — on one screen.
          </p>
        </div>

        <div className="mt-14 rounded-[32px] border border-white/12 bg-white/[0.05] p-4 shadow-[0_48px_140px_-52px_rgba(2,8,23,0.85)] backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-slate-950/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                Executive Overview
              </p>
              <p className="mt-1 text-sm font-semibold text-white/90">Q3 performance · All channels</p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Streaming live
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-4">
            {previewMetrics.map((metric) => (
              <div key={metric.label} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  {metric.label}
                </p>
                <p className="mt-3 font-mono text-3xl font-bold tracking-[-0.03em] text-white">{metric.value}</p>
                <p className={`mt-2 text-xs font-semibold ${metric.tone}`}>{metric.delta} vs last quarter</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                    Revenue &amp; predictive forecast
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Trending above plan</h3>
                </div>
                <span className="rounded-full bg-enterprise-blue/15 px-3 py-1 text-[11px] font-semibold text-enterprise-blue">
                  Forecast confidence 94%
                </span>
              </div>

              <div className="mt-6 flex h-40 items-end gap-1.5">
                {forecastBars.map((height, index) => (
                  <div key={index} className="flex flex-1 flex-col justify-end">
                    <div
                      className={`rounded-t-md ${
                        index > 8
                          ? "bg-gradient-to-t from-enterprise-gold/70 to-enterprise-gold"
                          : "bg-gradient-to-t from-enterprise-blue/70 via-blue-500/70 to-cyan-400/80"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-xs text-white/55">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-4 rounded-full bg-enterprise-blue" /> Actual revenue
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-4 rounded-full bg-enterprise-gold" /> Predicted range
                </span>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                Marketing attribution
              </p>
              <div className="mt-5 space-y-4">
                {previewChannels.map((channel) => (
                  <div key={channel.name}>
                    <div className="flex items-center justify-between text-sm text-white/75">
                      <span>{channel.name}</span>
                      <span className="font-mono font-semibold text-white">{channel.revenue}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-enterprise-blue to-cyan-400"
                        style={{ width: `${channel.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-enterprise-gold/25 bg-enterprise-gold/10 p-4">
                <div className="flex items-center gap-2 text-enterprise-gold">
                  <Sparkles size={14} />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">AI recommendation</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Shift 12% of paid social budget to lifecycle email to protect margin at current CAC.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4 — Deep Feature Breakdown ─────────────────────── */

const intelligencePillars = [
  {
    icon: Target,
    eyebrow: "Marketing Intelligence",
    title: "Know exactly which spend creates growth",
    accent: "text-enterprise-blue",
    surface: "bg-enterprise-blue/15",
    features: [
      "Multi-channel attribution",
      "Campaign performance",
      "Audience insights",
      "Budget optimization",
      "Predictive ROI modeling",
    ],
  },
  {
    icon: ShoppingBag,
    eyebrow: "Commerce Intelligence",
    title: "Protect margin across every product line",
    accent: "text-enterprise-gold",
    surface: "bg-enterprise-gold/15",
    features: [
      "Product performance",
      "Inventory forecasting",
      "Revenue breakdown",
      "Customer lifetime value",
      "Checkout optimization",
    ],
  },
  {
    icon: BrainCircuit,
    eyebrow: "Analytics Intelligence",
    title: "Turn raw data into executive decisions",
    accent: "text-cyan-400",
    surface: "bg-cyan-400/15",
    features: [
      "Custom dashboards",
      "KPI monitoring",
      "Automated anomaly detection",
      "Executive summaries",
      "AI-generated insights",
    ],
  },
];

export function IntelligencePillarsSection() {
  return (
    <section className="relative bg-slate-950 py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-enterprise-gold">
            Platform capabilities
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
            Three intelligence engines. One operating picture.
          </h2>
          <p className="mt-5 text-base leading-8 text-white/70 sm:text-lg">
            Each domain runs deep on its own and shares the same governed data layer, so
            marketing, commerce, and analytics never disagree on the numbers.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {intelligencePillars.map((pillar) => (
            <div
              key={pillar.eyebrow}
              className="flex flex-col rounded-[28px] border border-white/12 bg-white/[0.04] p-7 transition duration-300 hover:border-white/25"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${pillar.surface} ${pillar.accent}`}>
                <pillar.icon size={22} />
              </div>
              <p className={`mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] ${pillar.accent}`}>
                {pillar.eyebrow}
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-snug text-white">{pillar.title}</h3>

              <ul className="mt-6 flex-1 space-y-3 border-t border-white/10 pt-6">
                {pillar.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-white/70">
                    <BadgeCheck size={15} className={`mt-0.5 shrink-0 ${pillar.accent}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/features"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:gap-3"
              >
                Explore capability <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 5 — Enterprise Security & Compliance ───────────── */

const securityControls = [
  { icon: ShieldCheck, label: "SOC 2 Type II", detail: "Audited operational controls" },
  { icon: BadgeCheck, label: "ISO 27001", detail: "Certified security management" },
  { icon: ScrollText, label: "GDPR", detail: "Data residency and subject rights" },
  { icon: KeyRound, label: "SSO / SAML", detail: "Enterprise identity federation" },
  { icon: Fingerprint, label: "Role-based access", detail: "Least-privilege by default" },
  { icon: Lock, label: "Encryption", detail: "At rest and in transit" },
];

export function SecuritySection() {
  return (
    <section className="relative overflow-hidden bg-[#0A1A2F] py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-enterprise-blue/10 blur-[110px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-enterprise-gold">
            Security &amp; compliance
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
            Enterprise-Grade Security. Zero Compromise.
          </h2>
          <p className="mt-5 text-base leading-8 text-white/70 sm:text-lg">
            Built for regulated environments and security reviews. Every action is authenticated,
            authorized, and written to an immutable audit trail.
          </p>

          <div className="mt-8 rounded-[24px] border border-white/12 bg-white/[0.05] p-6">
            <div className="flex items-center gap-2 text-white/85">
              <ScrollText size={16} className="text-enterprise-gold" />
              <p className="text-sm font-semibold">Complete audit logging</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-white/65">
              Every data access, configuration change, and export is recorded with actor, timestamp,
              and tenant scope — exportable for your compliance team.
            </p>
          </div>

          <Link href="/contact" className="btn-outline mt-8 inline-flex px-7 py-3 text-sm">
            Request security documentation <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {securityControls.map((control) => (
            <div
              key={control.label}
              className="rounded-[24px] border border-white/12 bg-white/[0.04] p-6 transition duration-300 hover:border-enterprise-gold/35"
            >
              <control.icon size={20} className="text-enterprise-gold" />
              <p className="mt-4 text-base font-semibold text-white">{control.label}</p>
              <p className="mt-1.5 text-sm leading-6 text-white/60">{control.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 6 — Integrations Ecosystem ─────────────────────── */

const integrationGroups = [
  {
    icon: ShoppingBag,
    category: "Commerce",
    tools: ["Shopify", "WooCommerce", "Stripe", "PayPal"],
  },
  {
    icon: Megaphone,
    category: "Advertising",
    tools: ["Meta Ads", "Google Ads", "TikTok Ads"],
  },
  {
    icon: Users,
    category: "CRM",
    tools: ["HubSpot", "Salesforce"],
  },
  {
    icon: Database,
    category: "Data warehouse",
    tools: ["BigQuery", "Snowflake", "Zapier"],
  },
];

export function IntegrationsSection() {
  const marquee = [
    "Shopify",
    "WooCommerce",
    "Stripe",
    "PayPal",
    "Meta Ads",
    "Google Ads",
    "TikTok Ads",
    "HubSpot",
    "Salesforce",
    "BigQuery",
    "Snowflake",
    "Zapier",
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-enterprise-gold">
            Integrations ecosystem
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
            Connect Everything. Operate Seamlessly.
          </h2>
          <p className="mt-5 text-base leading-8 text-white/70 sm:text-lg">
            Bring your existing stack into one intelligence layer — no rip-and-replace, no
            data stranded in a tool nobody logs into.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {integrationGroups.map((group) => (
            <div key={group.category} className="rounded-[26px] border border-white/12 bg-white/[0.04] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-enterprise-blue">
                <group.icon size={19} />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-white/80">
                {group.category}
              </p>
              <ul className="mt-4 space-y-2">
                {group.tools.map((tool) => (
                  <li key={tool} className="flex items-center gap-2 text-sm text-white/65">
                    <span className="h-1.5 w-1.5 rounded-full bg-enterprise-gold" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] py-5">
          <div className="flex w-max animate-ticker gap-3">
            {[...marquee, ...marquee].map((tool, index) => (
              <span
                key={`${tool}-${index}`}
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-sm font-medium text-white/70"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 7 — Customer Stories ───────────────────────────── */

const customerStories = [
  {
    icon: TrendingUp,
    metric: "6.8%",
    label: "conversion lift",
    company: "Global retail group",
    quote:
      "We finally stopped arguing about whose number was right. One definition, one dashboard, and the conversion work compounded from there.",
    role: "VP of Growth",
  },
  {
    icon: PieChart,
    metric: "$2.4M",
    label: "revenue optimized",
    company: "Multi-brand commerce operator",
    quote:
      "Budget reallocation used to take a quarter of analysis. Now the platform surfaces the shift and we approve it in the weekly review.",
    role: "Chief Marketing Officer",
  },
  {
    icon: Gauge,
    metric: "142%",
    label: "attribution accuracy gain",
    company: "B2B SaaS enterprise",
    quote:
      "Attribution went from a debated spreadsheet to a board-ready report that finance signs off on without edits.",
    role: "Director of Analytics",
  },
];

export function CustomerStoriesSection() {
  return (
    <section className="relative bg-gradient-to-b from-slate-950 to-[#0A1A2F] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-enterprise-gold">
            Customer outcomes
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
            How Leading Companies Use Mrkgron to Grow.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {customerStories.map((story) => (
            <figure
              key={story.company}
              className="flex flex-col rounded-[28px] border border-white/12 bg-white/[0.04] p-7"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-400">
                  <story.icon size={19} />
                </div>
                <div>
                  <p className="font-mono text-3xl font-bold tracking-[-0.03em] text-white">{story.metric}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/50">{story.label}</p>
                </div>
              </div>

              <blockquote className="mt-6 flex-1 text-sm leading-7 text-white/72">
                &ldquo;{story.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm font-semibold text-white">{story.role}</p>
                <p className="mt-1 text-xs text-white/55">{story.company}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 8 — Pricing Overview ───────────────────────────── */

const pricingTiers = [
  {
    name: "Starter",
    description: "For teams establishing their first source of truth.",
    highlights: ["Core dashboards", "2 integrations", "Email support"],
  },
  {
    name: "Growth",
    description: "For scaling teams running multi-channel programs.",
    highlights: ["Attribution suite", "10 integrations", "Automation workflows"],
  },
  {
    name: "Professional",
    description: "For operators who need predictive and custom reporting.",
    highlights: ["Predictive forecasting", "Custom dashboards", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    description: "For regulated organizations with governance requirements.",
    highlights: ["SSO / SAML & RBAC", "Audit logs & SLA", "Dedicated success team"],
  },
];

export function PricingOverviewSection() {
  return (
    <section className="relative bg-slate-950 py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-enterprise-gold">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
            Flexible Plans for Every Stage of Growth.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-[26px] border p-7 transition duration-300 ${
                tier.featured
                  ? "border-enterprise-gold/45 bg-enterprise-gold/[0.07]"
                  : "border-white/12 bg-white/[0.04] hover:border-white/25"
              }`}
            >
              {tier.featured && (
                <span className="mb-4 w-fit rounded-full bg-enterprise-gold/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-enterprise-gold">
                  Most adopted
                </span>
              )}
              <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/62">{tier.description}</p>

              <ul className="mt-6 flex-1 space-y-2.5 border-t border-white/10 pt-6">
                {tier.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-white/70">
                    <BadgeCheck size={14} className="mt-0.5 shrink-0 text-enterprise-gold" />
                    {highlight}
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:gap-3"
              >
                View plan <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 9 — Final CTA ──────────────────────────────────── */

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#0A1A2F] py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-enterprise-blue/15 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
          <Layers size={12} className="text-enterprise-gold" />
          The unified intelligence layer
        </div>

        <h2 className="mt-7 text-3xl font-bold leading-[1.1] tracking-[-0.04em] sm:text-4xl lg:text-[3.4rem]">
          Ready to Operate with Executive-Grade Clarity?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
          Operate your entire business from one command center. Start your transformation today.
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Link href="/register" className="btn-gold px-8 py-3.5 text-base">
            Start Free Trial <ArrowRight size={16} />
          </Link>
          <Link href="/contact#demo" className="btn-outline px-8 py-3.5 text-base">
            Request Enterprise Demo
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/55">
          <span className="flex items-center gap-1.5">
            <BadgeCheck size={13} className="text-enterprise-gold" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-enterprise-gold" /> SOC 2 &amp; ISO 27001
          </span>
          <span className="flex items-center gap-1.5">
            <Bell size={13} className="text-enterprise-gold" /> Onboarding in days, not quarters
          </span>
        </div>
      </div>
    </section>
  );
}

/* ─── Trust bar ──────────────────────────────────────────────── */

export function TrustBar() {
  const badges = ["SOC 2 Type II", "ISO 27001", "GDPR compliant", "SSO / SAML", "99.9% uptime SLA"];

  return (
    <section className="border-y border-white/10 bg-slate-950 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
          Trusted by 2,000+ global brands
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/70"
            >
              <BadgeCheck size={13} className="text-enterprise-gold" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Dashboard system map ───────────────────────────────────── */

const dashboardModules = [
  { icon: Gauge, name: "Executive Overview", detail: "Revenue, customers, ROI, forecasting, alerts" },
  { icon: Target, name: "Marketing", detail: "Channels, attribution, campaigns, budget guidance" },
  { icon: ShoppingBag, name: "Commerce", detail: "Products, inventory, checkout funnel, AOV, LTV" },
  { icon: LineChart, name: "Analytics", detail: "Custom KPIs, trends, anomalies, data exports" },
  { icon: Users, name: "Customer Intelligence", detail: "Segments, behavior, retention, churn risk" },
  { icon: Workflow, name: "Automations", detail: "Workflow builder, triggers, scheduled tasks" },
  { icon: FileBarChart, name: "Reports", detail: "Board-ready exports and scheduled delivery" },
  { icon: Boxes, name: "Settings & Governance", detail: "Roles, permissions, audit and tenancy" },
];

export function DashboardSystemSection() {
  return (
    <section className="relative bg-slate-950 py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-enterprise-gold">
            Inside the command center
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
            Every module your operators need.
          </h2>
          <p className="mt-5 text-base leading-8 text-white/70 sm:text-lg">
            A consistent navigation model across the entire platform, so teams move between
            domains without relearning the interface.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardModules.map((module) => (
            <div
              key={module.name}
              className="rounded-[24px] border border-white/12 bg-white/[0.04] p-6 transition duration-300 hover:border-enterprise-blue/40"
            >
              <module.icon size={19} className="text-enterprise-blue" />
              <p className="mt-4 text-sm font-semibold text-white">{module.name}</p>
              <p className="mt-2 text-xs leading-6 text-white/58">{module.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/dashboard" className="btn-primary px-8 py-3.5 text-base">
            See Live Dashboard Preview <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
