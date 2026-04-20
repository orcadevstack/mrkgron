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
    title: "LizConMart — Unify Your Marketing, Analytics, and Commerce",
    description: "LizConMart empowers organizations with clarity, automation, and measurable results.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="font-sans antialiased text-rendering-optimizeLegibility">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
