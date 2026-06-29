import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WORLDFLIX - Free Live TV Channels",
  description:
    "Watch thousands of free live TV channels from around the world.",
  keywords: ["iptv", "live tv", "streaming", "free tv", "channels"],
  openGraph: {
    title: "WORLDFLIX - Free Live TV Channels",
    description:
      "Watch thousands of free live TV channels from around the world.",
    type: "website",
    siteName: "WORLDFLIX",
  },
  twitter: {
    card: "summary_large_image",
    title: "WORLDFLIX - Free Live TV Channels",
    description:
      "Watch thousands of free live TV channels from around the world.",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
