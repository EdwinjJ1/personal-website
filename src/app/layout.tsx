import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://evanlin.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Evan Lin — CS @ UNSW · AI · Builder",
    template: "%s · Evan Lin",
  },
  description:
    "Personal site of Evan Lin — Computer Science student at UNSW Sydney. Notes, projects, and news on AI, software engineering, and entrepreneurship.",
  applicationName: "Evan Lin",
  authors: [{ name: "Evan Lin", url: SITE_URL }],
  creator: "Evan Lin",
  keywords: [
    "Evan Lin",
    "UNSW",
    "Computer Science",
    "AI",
    "Personal Website",
    "Portfolio",
    "Blog",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Evan Lin",
    title: "Evan Lin — CS @ UNSW · AI · Builder",
    description:
      "Personal site of Evan Lin — Computer Science student at UNSW Sydney. Notes, projects, and news on AI, software engineering, and entrepreneurship.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Evan Lin — evanlin.site",
      },
    ],
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evan Lin — CS @ UNSW · AI · Builder",
    description:
      "Personal site of Evan Lin — Computer Science student at UNSW Sydney.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-icon.png", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

import Header from '@/components/Header';
import ClientRouter from '@/components/ClientRouter';
import Galaxy from '@/components/Galaxy';
import SplashOrchestrator from '@/components/SplashOrchestrator';
import GlobalTextCursor from '@/components/GlobalTextCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`} style={{backgroundColor: '#1a1816', color: '#e0d8cc'}} suppressHydrationWarning={true}>
        <Galaxy
          density={1}
          speed={0.8}
          glowIntensity={0.25}
          saturation={0}
          hueShift={160}
          twinkleIntensity={0.4}
          rotationSpeed={0.05}
          mouseInteraction={true}
          mouseRepulsion={true}
          repulsionStrength={1.5}
          transparent={true}
        />
        <ClientRouter />
        <GlobalTextCursor />
        <SplashOrchestrator>
          <Header />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </div>
        </SplashOrchestrator>
      </body>
    </html>
  );
}
