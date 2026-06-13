import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kiran BK",
  description: "Kiran BK — software engineer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={playfair.variable} suppressHydrationWarning>
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <Script id="anti-flash" strategy="beforeInteractive">{`
          (function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})()`}
        </Script>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
