import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/ui/Footer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSelect } from "@/components/ui/LanguageSelect";
import { LocaleInitializer } from "@/components/ui/LocaleInitializer";

// Aplica o tema salvo (ou preferência do SO) antes da hidratação — evita "flash".
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

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
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Providers>
          <LocaleInitializer />
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 sm:px-6">
                <Link
                  href="/events"
                  className="flex items-center gap-2 font-semibold tracking-tight text-slate-900 dark:text-slate-100"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                    <CalendarCheck2 className="h-5 w-5" />
                  </span>
                  EventPanel
                </Link>
                <div className="ml-auto flex items-center gap-2">
                  <LanguageSelect />
                  <ThemeToggle />
                </div>
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
