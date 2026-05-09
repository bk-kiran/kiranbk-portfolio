import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "kiran.sh",
  description: "Kiran BK — software engineer portfolio",
};

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'tokyonight';
      var themes = {
        tokyonight: { '--color-bg': '#1a1b26', '--color-bg-secondary': '#24283b', '--color-border': '#414868', '--color-text': '#c0caf5', '--color-text-dim': '#565f89', '--color-green': '#9ece6a', '--color-cyan': '#7dcfff', '--color-yellow': '#e0af68', '--color-magenta': '#bb9af7', '--color-red': '#f7768e', '--color-prompt': '#9ece6a' },
        solarized: { '--color-bg': '#002b36', '--color-bg-secondary': '#073642', '--color-border': '#586e75', '--color-text': '#839496', '--color-text-dim': '#657b83', '--color-green': '#859900', '--color-cyan': '#2aa198', '--color-yellow': '#b58900', '--color-magenta': '#d33682', '--color-red': '#dc322f', '--color-prompt': '#859900' },
        nord: { '--color-bg': '#2e3440', '--color-bg-secondary': '#3b4252', '--color-border': '#4c566a', '--color-text': '#d8dee9', '--color-text-dim': '#616e88', '--color-green': '#a3be8c', '--color-cyan': '#88c0d0', '--color-yellow': '#ebcb8b', '--color-magenta': '#b48ead', '--color-red': '#bf616a', '--color-prompt': '#a3be8c' },
        paper: { '--color-bg': '#f2ede4', '--color-bg-secondary': '#e8e0d0', '--color-border': '#c9b99a', '--color-text': '#282828', '--color-text-dim': '#7c6f64', '--color-green': '#427b58', '--color-cyan': '#076678', '--color-yellow': '#b57614', '--color-magenta': '#8f3f71', '--color-red': '#9d0006', '--color-prompt': '#427b58' }
      };
      var t = themes[theme] || themes.tokyonight;
      Object.keys(t).forEach(function(k) {
        document.documentElement.style.setProperty(k, t[k]);
      });
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
