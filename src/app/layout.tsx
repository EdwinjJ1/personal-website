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
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 to-black text-white`} suppressHydrationWarning={true}>
        <ClientRouter />
        <Header />
        {children}
      </body>
    </html>
  );
}
