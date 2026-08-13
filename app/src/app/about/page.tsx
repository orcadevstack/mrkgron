import Link from "next/link";
import { ArrowRight, Heart, Lightbulb, Scale, Users, Target, Globe, CheckCircle2, Zap } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export const metadata = {
  title: "About Us — Mrkgron",
  description: "Learn about Mrkgron's mission, vision, and values.",
  openGraph: {
    title: "About Mrkgron",
    description: "Built to empower every business to grow. Learn about our mission, team, and values.",
    url: "https://mrkgron.com/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Mrkgron",
    description: "Built to empower every business to grow.",
  },
};

const values = [
  {
    icon: Scale,
    title: "Transparency",
    desc: "We operate with openness and honesty, providing clear insights and straightforward pricing with no hidden surprises.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We continuously invest in cutting-edge technology to stay ahead of market trends and deliver next-generation capabilities.",
  },
  {
    icon: Globe,
    title: "Scalability",
    desc: "Our platform is engineered to grow with you — from your first campaign to enterprise-wide operations across multiple regions.",
  },
  {
    icon: Heart,
    title: "Customer-Centricity",
    desc: "Every product decision starts with the customer. We listen, iterate, and deliver solutions that truly move the needle.",
  },
];

const team = [
  { name: "Elizabeth Connors", role: "Chief Executive Officer", initials: "EC" },
  { name: "Marcus Osei", role: "Chief Technology Officer", initials: "MO" },
  { name: "Priya Sharma", role: "Chief Marketing Officer", initials: "PS" },
  { name: "David Chen", role: "VP of Product", initials: "DC" },
  { name: "Amara Diallo", role: "VP of Customer Success", initials: "AD" },
  { name: "James Kowalski", role: "Head of Engineering", initials: "JK" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        {/* Hero */}
        <section className="relative bg-hero-gradient hero-grid py-24 overflow-hidden">
          <div className="orb w-96 h-96 bg-brand-accent/20 -top-20 -left-20" />
          <div className="orb w-80 h-80 bg-brand-gold/10 bottom-0 right-10" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="tag-pill bg-white/10 text-white/80 mb-6 inline-block">
              About Mrkgron
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mt-4">
              Built to empower every{" "}
              <span className="text-brand-gold">business to grow</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed">
              Mrkgron was founded on the belief that marketing intelligence,
              data analytics, and commerce should not be separate — they should
              work as one.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="tag-pill bg-brand-accent/10 text-brand-accent mb-4 inline-block">
                  Mission
                </span>
                <h2 className="section-heading mt-3">
                  Empower businesses with clarity, automation, and measurable growth.
                </h2>
                <p className="mt-5 text-slate-500 leading-relaxed">
                  We exist to give organizations — of every size and industry — the
                  tools they need to understand their customers, communicate
                  effectively, and grow their digital operations with confidence.
                  Every feature we build, every integration we support, and every
                  decision we make is in service of this mission.
                </p>
                <Link href="/features" className="btn-primary mt-8 inline-flex">
                  Explore the Platform <ArrowRight size={16} />
                </Link>
              </div>
              <div className="rounded-2xl bg-brand-light border border-slate-100 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 flex items-center justify-center shrink-0">
                    <Target size={20} className="text-brand-indigo" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark">Vision</h3>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      To be the world&apos;s leading marketing, analytics, and commerce
                      automation platform — empowering millions of businesses to
                      compete and win in the digital economy.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center shrink-0">
                    <Zap size={20} className="text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark">Approach</h3>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      Automation-first, data-driven, and built on enterprise-grade
                      Django infrastructure that scales from your first customer
                      to your millionth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section id="values" className="py-24 bg-brand-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="tag-pill bg-brand-indigo/10 text-brand-indigo mb-4">
                Our Values
              </span>
              <h2 className="section-heading mt-3">
                Principles that <span className="gradient-text">guide us</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Icon size={22} className="text-brand-accent" />
                    </div>
                    <h3 className="font-bold text-brand-dark mb-2">{v.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="leadership" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="tag-pill bg-brand-gold/10 text-amber-700 mb-4">
                Leadership
              </span>
              <h2 className="section-heading mt-3">
                The team <span className="text-brand-gold">behind the platform</span>
              </h2>
              <p className="section-subheading mx-auto text-center">
                Experienced operators, engineers, and marketers united by a
                single mission.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member.name} className="card-feature flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offices */}
        <section id="offices" className="py-20 bg-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-8">
              Global presence, local expertise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["United States", "Europe", "Africa", "Asia"].map((loc) => (
                <div key={loc} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <Globe size={24} className="text-brand-accent mx-auto mb-3" />
                  <p className="text-white font-semibold">{loc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-light">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="section-heading">
              Ready to grow with <span className="gradient-text">Mrkgron?</span>
            </h2>
            <p className="section-subheading mx-auto text-center mt-3">
              Join thousands of businesses already driving measurable results.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact#demo" className="btn-primary text-base px-8 py-3.5">
                Request a Demo <ArrowRight size={16} />
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
