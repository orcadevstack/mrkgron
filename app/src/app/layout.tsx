import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
    title: {
        default: "Mrkgron — Unify Your Marketing, Analytics, and Commerce",
        template: "%s | Mrkgron",
    },
    description: "Mrkgron empowers organizations with clarity, automation, and measurable results — marketing, analytics, and commerce in one ecosystem.",
    metadataBase: new URL("https://mrkgron.com"),
    openGraph: {
        type: "website",
        siteName: "Mrkgron",
        title: "Mrkgron — Unify Your Marketing, Analytics, and Commerce",
        description: "Mrkgron empowers organizations with clarity, automation, and measurable results.",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mrkgron — Unify Your Marketing, Analytics, and Commerce",
        description: "Mrkgron empowers organizations with clarity, automation, and measurable results.",
    },
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: "/favicon.svg",
        shortcut: "/favicon.svg",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="font-sans antialiased">
                <a
                    href="#main-content"
                    className="skip-to-content"
                >
                    Skip to main content
                </a>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
