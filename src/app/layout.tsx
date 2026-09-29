import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import "./forest.css";
import "./experience.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ForestEnvironment, { ForestProvider } from "@/components/forest/ForestEnvironment";
import { ThemeProvider, themeInitScript } from "@/lib/theme";
import { site } from "@/data/site";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: site.title,
  applicationName: site.name,
  description: site.description,
  openGraph: {
    title: site.title,
    siteName: site.name,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-midnight text-cream antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <ForestProvider>
            <a className="skip-link" href="#main-content">Skip to content</a>
            <ForestEnvironment />
            <Navbar />
            <main id="main-content" tabIndex={-1} className="relative z-10 flex-1">{children}</main>
            <Footer />
          </ForestProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
