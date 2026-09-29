import type { Metadata } from "next";
import { Space_Grotesk, Oswald } from "next/font/google";
import "./globals.css";
import { ServiceWorkerCleaner } from "@/components/ServiceWorkerCleaner";
import { ThemeProvider } from "@/components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-gothic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifeOS",
  description: "Your personalized AI life planner and decision simulator.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${oswald.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="day"
          themes={["day", "color"]}
        >
          <ServiceWorkerCleaner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
