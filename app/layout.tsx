import type { Metadata } from "next";
import {
  Montserrat, Plus_Jakarta_Sans, JetBrains_Mono, Great_Vibes, Prata, Inter,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchOverlay from "@/components/SearchOverlay";

/* ------------------------------------------------------------------ *
 *  Type system:
 *    Montserrat        the masthead — geometric sans, run heavy and tight
 *                      at display size so the weight, not stroke contrast,
 *                      carries the headline
 *    Plus Jakarta      body copy, UI and card titles
 *    JetBrains Mono    uppercase micro-labels, tags and button text
 *    Great Vibes       the logo, and only the logo — a calligraphic script
 *                      standing in for the lettering in the brand artwork
 * ------------------------------------------------------------------ */
const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// single-weight face, so next/font needs the weight spelled out
const script = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// hero masthead — also single-weight, and normal-only (no italic)
const prata = Prata({
  variable: "--font-prata",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// hero copy, run at Light 300
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const display = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Campus Things — Wear Your Vibe · Merch for IITs, NITs & IIITs",
  description:
    "Campus Things — premium college apparel for every IIT, NIT and IIIT. Tees, oversized fits, hoodies, sweatshirts, lowers & joggers, caps and accessories. Wear your vibe.",
  keywords: [
    "campus things", "IIT merch", "NIT merch", "IIIT merch", "campus tshirt",
    "college hoodie", "college joggers", "college lowers", "campus apparel India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${script.variable} ${prata.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-page text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <SearchOverlay />
      </body>
    </html>
  );
}
