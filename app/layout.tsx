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

const description =
  "Kiran BK — software engineer building full-stack systems and AI/ML pipelines. " +
  "CS at UMass Amherst ('27), open to full-time SWE and ML roles in 2027.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kiranbk.com"),
  title: "Kiran BK",
  description,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Kiran BK",
    title: "Kiran BK — Software Engineer · AI/ML",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiran BK — Software Engineer · AI/ML",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={playfair.variable} suppressHydrationWarning>
      {/* suppressHydrationWarning: extensions like Grammarly inject attributes on <body> before hydration */}
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif" }} suppressHydrationWarning>
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
