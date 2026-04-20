import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Video,
  Newspaper,
  Code2,
  ChevronRight,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Resources — LizConMart",
  description: "Blog, case studies, whitepapers, webinars, and documentation.",
  openGraph: {
    title: "Resources — LizConMart",
    description: "Blog posts, case studies, whitepapers, webinars, and platform documentation for marketing and commerce leaders.",
    url: "https://lizconmart.com/resources",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources — LizConMart",
    description: "Insights for marketing and commerce leaders.",
  },
};

const blogPosts = [
  {
    category: "Marketing Strategy",
    title: "How Unified Marketing Platforms Reduce CAC by 40%",
    excerpt: "Discover how integrating your CRM, email, and analytics into one platform transforms acquisition economics.",
    date: "April 14, 2026",
    readTime: "6 min read",
    href: "#",
  },
  {
    category: "Analytics",
    title: "Behavioral Segmentation: The 2026 Playbook",
    excerpt: "A deep dive into how leading brands use real-time behavioral data to build segments that convert.",
    date: "April 8, 2026",
    readTime: "8 min read",
    href: "#",
  },
  {
    category: "E-Commerce",
    title: "From Zero to Storefront: Launching in 48 Hours",
    excerpt: "A step-by-step guide to launching a fully functional e-commerce storefront on LizConMart.",
    date: "March 28, 2026",
    readTime: "5 min read",
    href: "#",
  },
  {
    category: "Automation",
    title: "10 Customer Journey Flows Every Business Should Have",
    excerpt: "The automated workflows that top-performing brands use to engage, convert, and retain at scale.",
    date: "March 19, 2026",
    readTime: "7 min read",
    href: "#",
  },
];

const caseStudies = [
  {
    company: "RetailNova",
    industry: "Retail & E-Commerce",
    result: "3.2× revenue growth",
    highlight: "Unified marketing and commerce to triple online revenue in 6 months.",
    href: "#",
  },
  {
    company: "FinEdge Capital",
    industry: "Financial Services",
    result: "58% lower churn",
    highlight: "Behavioral segmentation and automated journeys reduced customer churn by over half.",
    href: "#",
  },
  {
    company: "HealthBridge",
    industry: "Healthcare",
    result: "4× patient engagement",
    highlight: "Personalized communication programs quadrupled patient engagement rates.",
    href: "#",
  },
];

const whitepapers = [
  {
    title: "The State of Marketing Automation 2026",
    desc: "A comprehensive report on trends, benchmarks, and predictions shaping marketing technology.",
    pages: "48 pages",
    href: "#",
  },
  {
    title: "Unified Commerce: The CFO's Guide",
    desc: "How leading finance teams are measuring and maximising ROI from integrated commerce platforms.",
    pages: "32 pages",
    href: "#",
  },
  {
    title: "Data-Driven Growth: From Insights to Action",
    desc: "Practical frameworks for turning analytics data into campaign decisions that move the revenue needle.",
    pages: "56 pages",
    href: "#",
  },
];

const webinars = [
  {
    title: "Building Your First Automated Journey",
    date: "May 7, 2026",
    time: "2:00 PM ET",
    type: "Live Webinar",
    href: "#",
  },
  {
    title: "Analytics Deep Dive: Reading Your Dashboard",
    date: "May 14, 2026",
    time: "11:00 AM ET",
    type: "Live Webinar",
    href: "#",
  },
  {
    title: "E-Commerce Launch Masterclass",
    date: "On-Demand",
    time: "",
    type: "On-Demand",
    href: "#",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        {/* Hero */}
        <section className="bg-hero-gradient hero-grid py-24 text-center relative overflow-hidden">
          <div className="orb w-80 h-80 bg-brand-cyan/20 top-0 right-1/4" />
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <span className="tag-pill bg-white/10 text-white/80 mb-6 inline-block">
              Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mt-4">
              Learn, grow, and{" "}
              <span className="text-brand-gold">stay ahead</span>
            </h1>
            <p className="mt-5 text-lg text-white/70">
              Practical insights, real-world case studies, and expert
              knowledge to help your business grow with LizConMart.
            </p>
          </div>
        </section>

        {/* Resource Type Nav */}
        <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-3">
              {[
                ["#blog", "Blog"],
                ["#case-studies", "Case Studies"],
                ["#whitepapers", "Whitepapers"],
                ["#webinars", "Webinars"],
                ["#docs", "Documentation"],
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

        {/* Blog */}
        <section id="blog" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="tag-pill bg-brand-accent/10 text-brand-accent mb-3 inline-block">Blog</span>
                <h2 className="section-heading mt-1">Latest articles</h2>
              </div>
              <Link href="#" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent hover:gap-3 transition-all">
                View all posts <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.title}
                  href={post.href}
                  className="card-feature group flex flex-col"
                >
                  <span className="tag-pill bg-brand-accent/10 text-brand-accent text-xs mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-brand-dark text-sm leading-snug mb-2 group-hover:text-brand-accent transition-colors flex-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section id="case-studies" className="py-20 bg-brand-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="tag-pill bg-brand-indigo/10 text-brand-indigo mb-4 inline-block">Case Studies</span>
            <h2 className="section-heading mt-1 mb-10">Real results from real businesses</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {caseStudies.map((cs) => (
                <div key={cs.company} className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{cs.industry}</p>
                  <h3 className="font-bold text-brand-dark text-lg mb-2">{cs.company}</h3>
                  <p className="text-3xl font-bold gradient-text mb-3">{cs.result}</p>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">{cs.highlight}</p>
                  <Link
                    href={cs.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent group-hover:gap-3 transition-all"
                  >
                    Read case study <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Whitepapers */}
        <section id="whitepapers" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="tag-pill bg-brand-gold/10 text-amber-700 mb-4 inline-block">Whitepapers</span>
            <h2 className="section-heading mt-1 mb-10">In-depth research and analysis</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {whitepapers.map((wp) => (
                <div key={wp.title} className="card-feature group">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4">
                    <FileText size={20} className="text-brand-gold" />
                  </div>
                  <h3 className="font-bold text-brand-dark mb-2 leading-snug">{wp.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{wp.desc}</p>
                  <p className="text-xs text-slate-400 mb-4">{wp.pages}</p>
                  <Link
                    href={wp.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent group-hover:gap-3 transition-all"
                  >
                    Download PDF <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Webinars */}
        <section id="webinars" className="py-20 bg-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="tag-pill bg-white/10 text-white/80 mb-4 inline-block">Webinars</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-1 mb-10">
              Live sessions & <span className="text-brand-gold">on-demand</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {webinars.map((w) => (
                <div key={w.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <Video size={16} className="text-brand-cyan" />
                    <span className="text-xs font-medium text-brand-cyan">{w.type}</span>
                  </div>
                  <h3 className="font-bold text-white mb-3 leading-snug">{w.title}</h3>
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-5">
                    <Calendar size={13} />
                    <span>{w.date}</span>
                    {w.time && <span>· {w.time}</span>}
                  </div>
                  <Link href={w.href} className="btn-primary text-sm px-4 py-2">
                    {w.type === "On-Demand" ? "Watch Now" : "Register Free"} <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section id="docs" className="py-20 bg-brand-light text-center">
          <div className="max-w-2xl mx-auto px-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center mx-auto mb-6">
              <Code2 size={26} className="text-brand-accent" />
            </div>
            <span className="tag-pill bg-brand-accent/10 text-brand-accent mb-4 inline-block">Documentation</span>
            <h2 className="section-heading mt-3">
              Comprehensive developer docs
            </h2>
            <p className="section-subheading mx-auto text-center mt-3">
              REST API references, SDK guides, webhook documentation, and
              integration tutorials — everything you need to build on LizConMart.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="#" className="btn-primary text-base px-8 py-3.5">
                Open Documentation <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-brand-accent text-brand-accent font-semibold text-base hover:bg-brand-accent/5 transition-colors">
                Developer Support
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
