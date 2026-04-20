import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  BarChart3,
  ShoppingCart,
  Users,
  Zap,
  Globe,
  Lock,
  RefreshCw,
  Boxes,
  MailCheck,
  LineChart,
  Tag,
  Truck,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Features — LizConMart",
  description: "Explore all LizConMart platform features: communications, analytics, and commerce.",
  openGraph: {
    title: "Platform Features — LizConMart",
    description: "Every tool you need. One platform. From multi-channel communications to predictive analytics and full-stack commerce.",
    url: "https://lizconmart.com/features",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Features — LizConMart",
    description: "Every tool you need. One platform.",
  },
};

const communicationsFeatures = [
  { icon: MailCheck, title: "Email & SMS Campaigns", desc: "Design and send personalised multi-channel campaigns with drag-and-drop editors and dynamic content blocks." },
  { icon: RefreshCw,  title: "Automated Journeys",   desc: "Build visual customer journey flows triggered by behaviour, dates, or custom events." },
  { icon: Users,      title: "CRM & Segmentation",   desc: "Maintain rich customer profiles and create dynamic audience segments based on any attribute or action." },
  { icon: Zap,        title: "Personalization Engine", desc: "Serve the right message to the right person at the right time using AI-powered personalization." },
];

const analyticsFeatures = [
  { icon: BarChart3,   title: "Unified Dashboards",     desc: "Centralize KPIs from every channel into a single real-time dashboard for full business visibility." },
  { icon: LineChart,   title: "Predictive Analytics",   desc: "Leverage machine learning models to forecast revenue, churn, and campaign performance." },
  { icon: Users,       title: "Behavioral Insights",    desc: "Understand how customers interact with your brand and identify high-value engagement patterns." },
  { icon: Globe,       title: "Cross-Channel Reporting", desc: "Track performance across email, SMS, social, and commerce in one unified reporting suite." },
];

const commerceFeatures = [
  { icon: ShoppingCart, title: "Storefront Management",  desc: "Launch and manage fully branded online stores with flexible templates and custom domains." },
  { icon: Tag,          title: "Product Catalog",        desc: "Organize products, manage inventory, and run dynamic merchandising campaigns at scale." },
  { icon: CreditCard,   title: "Payment Integration",    desc: "Accept global payments with support for 50+ payment providers and multi-currency checkout." },
  { icon: Truck,        title: "Logistics Coordination", desc: "Integrate with leading shipping providers and automate fulfillment workflows end-to-end." },
];

const platformFeatures = [
  { icon: Lock,   title: "Enterprise Security",    desc: "SOC 2 Type II, GDPR compliance, role-based access control, and end-to-end encryption." },
  { icon: Boxes,  title: "API & Integrations",     desc: "Connect to 200+ tools via native integrations or use our open REST and webhook APIs." },
  { icon: Globe,  title: "Multi-Region Support",   desc: "Deploy across global data centers with multi-currency, multi-language, and multi-timezone capabilities." },
  { icon: RefreshCw, title: "Automation Workflows", desc: "Build no-code workflows that automate repetitive tasks across every module of the platform." },
];

function FeatureGroup({
  id,
  tag,
  tagColor,
  Icon,
  headline,
  sub,
  features,
  cta,
  reverse = false,
}: {
  id: string;
  tag: string;
  tagColor: string;
  Icon: React.ElementType;
  headline: React.ReactNode;
  sub: string;
  features: { icon: React.ElementType; title: string; desc: string }[];
  cta: string;
  reverse?: boolean;
}) {
  return (
    <section id={id} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid md:grid-cols-2 gap-16 items-start ${reverse ? "md:flex-row-reverse" : ""}`}>
          <div>
            <span className={`tag-pill mb-4 inline-block ${tagColor}`}>{tag}</span>
            <h2 className="section-heading mt-3">{headline}</h2>
            <p className="section-subheading mt-4">{sub}</p>
            <Link href={cta} className="btn-primary mt-8 inline-flex">
              Get started <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f) => {
              const FIcon = f.icon;
              return (
                <div key={f.title} className="card-feature">
                  <div className="w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center mb-3">
                    <FIcon size={18} className="text-brand-accent" />
                  </div>
                  <h3 className="font-bold text-brand-dark text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        {/* Hero */}
        <section className="bg-hero-gradient hero-grid py-24 relative overflow-hidden">
          <div className="orb w-96 h-96 bg-brand-accent/20 -top-20 left-1/4" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="tag-pill bg-white/10 text-white/80 mb-6 inline-block">
              Platform Features
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mt-4">
              Every tool you need.{" "}
              <span className="text-brand-gold">One platform.</span>
            </h1>
            <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
              From multi-channel communications to predictive analytics and
              full-stack commerce — LizConMart brings it all together.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="btn-gold text-base px-8 py-3.5">
                Start Free Trial <ArrowRight size={16} />
              </Link>
              <Link href="/contact#demo" className="btn-outline text-base px-8 py-3.5">
                Request a Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Nav */}
        <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
              {[
                ["#communications", "Communications"],
                ["#analytics",      "Analytics"],
                ["#commerce",       "Commerce"],
                ["#platform",       "Platform"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-brand-accent hover:bg-brand-accent/5 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Communications */}
        <div className="bg-white">
          <FeatureGroup
            id="communications"
            tag="Communications"
            tagColor="bg-blue-500/10 text-blue-600"
            Icon={MessageSquare}
            headline={<>Digital Communications &amp; <span className="gradient-text">Customer Engagement</span></>}
            sub="Drive deeper relationships with personalized, automated, multi-channel communication strategies that retain customers and grow revenue."
            features={communicationsFeatures}
            cta="/solutions"
          />
        </div>

        {/* Analytics */}
        <div className="bg-brand-light">
          <FeatureGroup
            id="analytics"
            tag="Analytics & BI"
            tagColor="bg-indigo-500/10 text-indigo-600"
            Icon={BarChart3}
            headline={<>Data Analytics, Insights &amp; <span className="gradient-text">Business Intelligence</span></>}
            sub="Transform raw data into competitive intelligence with unified dashboards, behavioral insights, and evidence-based forecasting models."
            features={analyticsFeatures}
            cta="/solutions"
            reverse
          />
        </div>

        {/* Commerce */}
        <div className="bg-white">
          <FeatureGroup
            id="commerce"
            tag="Commerce"
            tagColor="bg-amber-500/10 text-amber-700"
            Icon={ShoppingCart}
            headline={<>E-Commerce Growth &amp; <span className="text-brand-gold">Digital Retail</span></>}
            sub="Launch and scale digital storefronts, optimize conversions, and coordinate logistics — all from within the LizConMart platform."
            features={commerceFeatures}
            cta="/solutions"
          />
        </div>

        {/* Platform-wide */}
        <section id="platform" className="py-24 bg-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="tag-pill bg-white/10 text-white/80 mb-4">
                Platform Infrastructure
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                Built for <span className="text-brand-gold">enterprise scale</span>
              </h2>
              <p className="text-white/55 text-lg mt-3 max-w-2xl mx-auto">
                Security, integrations, and automation baked into every layer.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {platformFeatures.map((f) => {
                const FIcon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center mb-4">
                      <FIcon size={20} className="text-brand-accent" />
                    </div>
                    <h3 className="font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-light text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="section-heading">
              Ready to see every feature <span className="gradient-text">in action?</span>
            </h2>
            <p className="section-subheading mx-auto text-center mt-3">
              Book a personalized demo and our team will walk you through the
              features most relevant to your business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact#demo" className="btn-primary text-base px-8 py-3.5">
                Book a Demo <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-brand-accent text-brand-accent font-semibold text-base hover:bg-brand-accent/5 transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
