// app/layout.tsx - Root Layout with Metadata API & Font Optimization
// Modul 6 - Next.js App Router Implementation
// Demonstrates RSC (React Server Components) patterns and Core Web Vitals optimization

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Static Metadata - Best Practice for SEO
export const metadata: Metadata = {
  title: "AquaSmart AIoT - Dashboard Monitoring",
  description: "Smart Aquaculture Monitoring System untuk monitoring kualitas air real-time (pH, suhu, turbidity)",
  keywords: ["aquaculture", "IoT", "water quality", "monitoring", "smart farming"],
  authors: [{ name: "Alpin Aditya Pratama & Dimas Aryo Sejati" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "AquaSmart AIoT Dashboard",
    description: "Monitoring sistem aquaculture berbasis IoT dengan notifikasi real-time",
    url: "https://aquasmart.example.com",
    siteName: "AquaSmart AIoT",
    locale: "id_ID",
    type: "website",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

// Default export as Server Component (RSC)
// TIDAK memerlukan "use client" directive karena tidak ada browser APIs
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload LCP image (if any hero images) */}
        {/* <link rel="preload" href="/hero-image.webp" as="image" type="image/webp" fetchPriority="high" /> */}
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
