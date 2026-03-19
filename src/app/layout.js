import { Barlow_Condensed } from "next/font/google";
import Header from "@/components/Header/Header";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
});

export const metadata = {
  title: "Houston Land Rovers",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${barlowCondensed.variable} antialiased`}>
        <Header />

        <main>{children}</main>
      </body>
    </html>
  );
}
