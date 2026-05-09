import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import { SpeedInsights } from '@vercel/speed-insights/next'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-zinc-950 text-white">
        <SessionWrapper>
          
          {/* Main Content (The header is now handled safely inside page.tsx) */}
          <main className="min-h-screen">
            {children}
          </main>
          
        </SessionWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}