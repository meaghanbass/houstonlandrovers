import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header/Header";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const siteDescription =
  "Houston-area club for Land Rover owners — trail runs, meetups, tech help, and Gulf Coast camaraderie. All eras welcome; join our next drive.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Houston Land Rovers",
  description: siteDescription,
  openGraph: {
    title: "Houston Land Rovers",
    description: siteDescription,
    images: [
      {
        url: "/opengraph.png",
        alt: "Houston Land Rovers",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlowCondensed.variable} antialiased`}>
        <Header />

        <main>
          {children}
          <Analytics />
        </main>
      </body>
    </html>
  );
}
