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

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Houston Land Rovers",
  description: "",
  openGraph: {
    title: "Houston Land Rovers",
    description: "",
    images: [
      {
        url: "/opengraph.png",
        alt: "Houston Land Rovers",
      },
    ],
  },
};

export default function RootLayout({ children }) {
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
