import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evan's Portfolio",
  description: "A personal portfolio website for Evan.",
};

import Header from '@/components/Header';
import ClientRouter from '@/components/ClientRouter';
import Galaxy from '@/components/Galaxy';

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
        <Header />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
