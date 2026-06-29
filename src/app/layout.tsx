import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "@/context/AppProviders";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientLayout from "@/components/ClientLayout";
import DirectionProvider from "@/components/DirectionProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = localFont({
  src: "../fonts/Geist-Regular.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMono-Regular.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Quran Companion — Find Comfort in the Quran",
  description:
    "Receive Quran verses and authentic duas related to what you're experiencing.",
  keywords: ["Quran", "Islamic", "Duas", "Spiritual", "Mood", "Remembrance", "Dhikr"],
  authors: [{ name: "Ahmed Jaballah" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quran Companion",
  },
  openGraph: {
    title: "Quran Companion",
    description: "Receive Quran verses and authentic duas related to what you're experiencing.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  themeColor: "#0F5132",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Quran Companion" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen flex flex-col bg-cream dark:bg-gray-900 text-dark dark:text-gray-100 antialiased">
        <ServiceWorkerRegister />
        <AppProviders>
          <DirectionProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">
                <ClientLayout>{children}</ClientLayout>
              </main>
              <Footer />
            </ToastProvider>
          </DirectionProvider>
        </AppProviders>
      </body>
    </html>
  );
}
