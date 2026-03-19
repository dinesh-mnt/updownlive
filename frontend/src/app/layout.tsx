import type { Metadata } from "next";
import "./globals.css";
import { Outfit} from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/UI/Toaster";
import BackToTop from "@/components/UI/BackToTop";
import { ThemeProvider } from "@/components/theme-provider";



const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});


export async function generateMetadata(): Promise<Metadata> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    // We add cache: 'no-store' during development/testing so it reflects instantly. 
    // In production, 'force-cache' with revalidation is usually better.
    const res = await fetch(`${apiUrl}/settings/seo`, { cache: 'no-store' });
    const data = await res.json();
    const seoSettingsMap = data?.seo || {};
    // Extract the global data, but allow falling back to empty if undefined
    const seo = seoSettingsMap.global || seoSettingsMap.home || seoSettingsMap || {};

    const origin = seo.ogUrl || "https://updownlive.com";
    const title = seo.title || "UpDownLive - Global Market & News Portal";
    const description = seo.description || "Real-time global market data, latest financial news, and insights.";

    return {
      title,
      description,
      keywords: seo.keywords || "finance, market, crypto, forex, gold, brokers",
      metadataBase: new URL(origin),
      openGraph: {
        title,
        description,
        url: origin,
        siteName: title,
        images: seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: seo.ogImage ? [seo.ogImage] : [],
      },
    };
  } catch (error) {
    return {
      title: "UpDownLive - Global Market & News Portal",
      description: "Real-time global market data, latest financial news, and insights.",
    };
  }
}

export default function RootLayout({
 children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "font-sans")} suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-outfit antialiased h-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <BackToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
