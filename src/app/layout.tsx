import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TEMUIN",
  description:
    "Sistem resmi kampus untuk laporan dan verifikasi barang hilang dan temuan.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full bg-[var(--color-ivory)] text-[var(--color-ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
