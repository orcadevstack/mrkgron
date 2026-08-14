export type WikiSection = "Guides" | "Platform" | "System" | "Developers" | "Reference";

export type WikiPage = {
  description: string;
  fileName: string;
  keywords: readonly string[];
  section: WikiSection;
  slug: string;
  title: string;
};

export const WIKI_PAGES: readonly WikiPage[] = [
  { slug: "getting-started", title: "Getting Started", description: "Create an account, sign in, and orient a new operator.", fileName: "getting-started.md", section: "Guides", keywords: ["account", "login", "dashboard", "onboarding"] },
  { slug: "platform-overview", title: "Platform Overview", description: "Understand Mrkgron operating modules and their responsibilities.", fileName: "platform-overview.md", section: "Platform", keywords: ["dashboard", "accounts", "transactions", "investments", "compliance", "billing", "settings"] },
  { slug: "dashboard", title: "Dashboard", description: "Read operating performance and priority signals.", fileName: "dashboard.md", section: "Platform", keywords: ["dashboard", "metrics", "reporting", "overview"] },
  { slug: "accounts", title: "Accounts", description: "Manage authorized workspace users and operating access.", fileName: "accounts.md", section: "Platform", keywords: ["accounts", "users", "roles", "access"] },
  { slug: "transactions", title: "Transactions", description: "Review commerce and operational transaction records.", fileName: "transactions.md", section: "Platform", keywords: ["transactions", "orders", "commerce", "records"] },
  { slug: "investments", title: "Investments", description: "Review investment-oriented reporting and performance context.", fileName: "investments.md", section: "Platform", keywords: ["investments", "reporting", "returns", "performance"] },
  { slug: "compliance", title: "Compliance", description: "Apply controlled access, audit, and data governance practices.", fileName: "compliance.md", section: "Platform", keywords: ["compliance", "security", "audit", "privacy"] },
  { slug: "billing", title: "Billing", description: "Understand commercial records and workspace billing controls.", fileName: "billing.md", section: "Platform", keywords: ["billing", "plans", "invoices", "payment"] },
  { slug: "settings", title: "Settings", description: "Set workspace defaults and operator preferences.", fileName: "settings.md", section: "Platform", keywords: ["settings", "preferences", "notifications", "workspace"] },
  { slug: "premium-filters", title: "Premium Filter System", description: "Use controlled filters to refine operational datasets.", fileName: "premium-filters.md", section: "System", keywords: ["filters", "search", "status", "data"] },
  { slug: "header-footer", title: "Header and Footer System", description: "Understand shared navigation, footer, and branding controls.", fileName: "header-footer.md", section: "System", keywords: ["header", "footer", "navigation", "social"] },
  { slug: "branding", title: "Branding and Identity", description: "Apply the Mrkgron logo, palette, typography, and visual rules.", fileName: "branding.md", section: "System", keywords: ["brand", "logo", "color", "typography"] },
  { slug: "developer", title: "Developer Documentation", description: "Connect to the API, authenticate requests, and operate integrations.", fileName: "developer.md", section: "Developers", keywords: ["api", "sdk", "authentication", "webhooks", "integrations", "error codes"] },
  { slug: "release-notes", title: "Release Notes", description: "Review published features, corrections, and operating improvements.", fileName: "release-notes.md", section: "Reference", keywords: ["releases", "versions", "fixes", "improvements"] },
  { slug: "faq", title: "FAQ", description: "Resolve common product, access, and support questions.", fileName: "faq.md", section: "Reference", keywords: ["faq", "troubleshooting", "support", "help"] },
  { slug: "legal-compliance", title: "Legal and Compliance", description: "Review service terms, privacy, security, and data handling references.", fileName: "legal-compliance.md", section: "Reference", keywords: ["terms", "privacy", "security", "data handling"] },
] as const;

export const WIKI_SECTIONS: readonly WikiSection[] = ["Guides", "Platform", "System", "Developers", "Reference"];

export function findWikiPage(slug: string) {
  return WIKI_PAGES.find((page) => page.slug === slug);
}