import type { Metadata } from "next";
import {
  Caveat,
  Cormorant_Garamond,
  Libre_Baskerville,
  Montserrat,
} from "next/font/google";
import { SiteMenu } from "@/components/SiteMenu";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Najbliższy darmowy odpowiednik Garamond Premier Pro Display (Adobe) */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stowarzyszenie Ochotnicy Wolności",
  description:
    "Upowszechniamy wiedzę historyczną i działamy na rzecz pamięci o osobach, organizacjach i ruchach wykluczonych z dominującej narracji historycznej.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${montserrat.variable} ${caveat.variable} ${baskerville.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-[var(--ow-text)]">
        <SiteMenu />
        {children}
      </body>
    </html>
  );
}
