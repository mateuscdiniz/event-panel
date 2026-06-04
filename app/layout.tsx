import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/ui/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EventPanel — Gestão de Eventos",
  description: "Painel de gestão de eventos: listagem, métricas e check-in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
              <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 sm:px-6">
                <Link
                  href="/events"
                  className="flex items-center gap-2 font-semibold tracking-tight text-slate-900"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                    <CalendarCheck2 className="h-5 w-5" />
                  </span>
                  EventPanel
                </Link>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
