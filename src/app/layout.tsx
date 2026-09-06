import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Al Burhan Quran Academy",
  description: "Online Quran Classes for all ages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Lato:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[var(--color-black)]">
        <main className="flex flex-col flex-1">{children}</main>
      </body>
    </html>
  );
}