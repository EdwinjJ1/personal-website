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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`} style={{backgroundColor: '#1a1816', color: '#e0d8cc'}} suppressHydrationWarning={true}>
        <ClientRouter />
        <Header />
        {children}
      </body>
    </html>
  );
}
