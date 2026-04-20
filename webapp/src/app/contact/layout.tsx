import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — LizConMart",
  description: "Get in touch with LizConMart. Request a demo, ask about pricing, or discuss enterprise opportunities.",
  openGraph: {
    title: "Contact LizConMart",
    description: "Let's talk about your growth. Request a demo or reach out to our team.",
    url: "https://lizconmart.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact LizConMart",
    description: "Let's talk about your growth.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
