import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Grammar AI - Your AI Grammar Assistant",
  description:
    "Enhance your writing with AI-powered grammar corrections and suggestions. Get real-time feedback to improve your writing quality.",
  keywords:
    "grammar checker, AI writing assistant, grammar correction, writing improvement, language enhancement",
  authors: [{ name: "Grammar AI Team" }],
  creator: "Grammar AI",
  publisher: "Grammar AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://grammarai.com",
    siteName: "Grammar AI",
    title: "Grammar AI - Your AI Grammar Assistant",
    description:
      "Enhance your writing with AI-powered grammar corrections and suggestions. Get real-time feedback to improve your writing quality.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Grammar AI - Your AI Grammar Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grammar AI - Your AI Grammar Assistant",
    description:
      "Enhance your writing with AI-powered grammar corrections and suggestions. Get real-time feedback to improve your writing quality.",
    images: ["/twitter-image.png"],
    creator: "@grammarai",
    site: "@grammarai",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-site-verification",
    other: {
      me: ["your-additional-verification"],
    },
  },
  alternates: {
    canonical: "https://grammarai.com",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  themeColor: "#ffffff",
  appleWebApp: {
    title: "Grammar AI",
    statusBarStyle: "default",
    capable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${lato.className} antialiased`}>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
